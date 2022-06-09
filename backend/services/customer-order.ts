import { debug } from 'console';
import { Customer } from '../models/customer';
import { Order } from '../models/order';
import { TierRule } from '../models/tier-rule';
import { CustomerRepository } from '../repositories/customer-repository';
import { OrderRepository } from '../repositories/order-repository';
import { TierRuleRepository } from '../repositories/tier-rule-repository';
import { dbDateTimeUtil } from '../utilities/dbDateTimeUtil';
import { CustomerVM } from './customer-vm';

export class CustomerOrderService {
    private orderRepository = new OrderRepository();
    private customerRepository = new CustomerRepository();
    private tierRuleRepository = new TierRuleRepository();

    async saveOrder(order: Order): Promise<CustomerVM> {
        const customer = new Customer(order.customerId, order.customerName, 1);
        // first create a new customer if not exist
        await this.customerRepository.saveIfNotExists(customer);
        // then save order
        await this.orderRepository.save(order);
        // recalculate the customer's loyalty tier if the order is of last year or if the customer is new
        if ((new Date(order.date).getUTCFullYear() - new Date().getUTCFullYear()) === -1 || customer.calcFromDate === null) {
            const customerVM = await this.updateCustomerLoyaltyTier(customer.id);
            return Promise.resolve(customerVM);
        } else {
            return this.decorateToVM(customer);
        }
    }

    /**
     * Get customer view model for a customer id
     * @param customerId the customer id
     * @returns a customer view model
     */
    async getCustomerWithStats(customerId: string): Promise<CustomerVM> {
        const customer = await this.customerRepository.getCustomerById(customerId);
        if (customer === null) {
            return Promise.resolve(null);
        }
        const customerVM = this.decorateToVM(customer);
        return Promise.resolve(customerVM);
    }

    /**
     * Calculate and update loyal tier for all customers
     * @param batchSize number of the customers that are processed and updated into database in batch, default is 500
     * @returns the number of affected customers and changed customers
     */
    async updateAllCustomerLoyaltyTiers(batchSize: number = 500): Promise<any> {
        const customerIds = await this.customerRepository.getAllCustomerIds();
        let affectedRows = 0;let changedRows = 0;
        let remainingNumber = customerIds.length;
        while(remainingNumber > 0) {
            const thisBatchSize = Math.min(batchSize, customerIds.length);
            const thisBatchIds: string[] = new Array<string>();
            for (let i = 0; i < thisBatchSize; i ++) {
                const id = customerIds.pop();
                thisBatchIds.push(id);
            }

            const batchCustomers = await this.customerRepository.getCustomersByIds(thisBatchIds);
            const totalSpentList = await this.orderRepository.getOrdersTotalByCustomerIds(thisBatchIds, dbDateTimeUtil.getUTCStartOfLastYear(), dbDateTimeUtil.getUTCEndOfLastYear());
            const tierRules = await this.tierRuleRepository.getAll();
            for (let j = 0; j < batchCustomers.length; j ++) {
                const customer = batchCustomers[j];
                let totalInCents = 0;
                for (const totalSpent of totalSpentList) {
                    if (totalSpent.customerId === customer.id) {
                        totalInCents = totalSpent.totalInCents;
                        break;
                    }
                }
                batchCustomers[j] = this.calculateLoyaltyTier(customer, tierRules, totalInCents);
            }
            if (batchCustomers.length > 0) {
                const batchResult = await this.customerRepository.updateAll(batchCustomers);
                affectedRows += batchResult.affectedRows;
                changedRows += batchResult.changedRows;
            }
            remainingNumber -= thisBatchSize;
        }
        return Promise.resolve({
            affectedRows,
            changedRows
        });
    }

    /**
     * Calculate and update loyal tier for a customer
     * @param customerId the customer id
     * @returns a customer view model
     */
    async updateCustomerLoyaltyTier(customerId: string): Promise<CustomerVM> {
        let customer: Customer = await this.customerRepository.getCustomerById(customerId);
        if (customer === null) {
            return Promise.resolve(null);
        }
        // get last year spent in cents, and update the customer object
        const totalSpentInCents: number = await this.getLastYearSpentTotalInCents(customer.id);
        const tierRules = await this.tierRuleRepository.getAll();

        customer = this.calculateLoyaltyTier(customer, tierRules, totalSpentInCents);
        // update the customer to database
        await this.customerRepository.update(customer);

        const customerVM = this.decorateToVM(customer);
        return customerVM;
    }

    /**
     * Calculate loyal tier for a customer according to last year total spent
     * @param customer the customer object
     * @param tierRules the tier rules
     * @param totalSpentInCents the total spent in cents of last year
     * @returns updated customer object
     */
    private calculateLoyaltyTier(customer: Customer, tierRules: TierRule[], totalSpentInCents: number): Customer {
        customer.calcFromDate = dbDateTimeUtil.toDate(dbDateTimeUtil.getUTCStartOfLastYear());
        customer.calcToDate = dbDateTimeUtil.toDate(dbDateTimeUtil.getUTCEndOfLastYear());
        customer.calcSpentInCents = totalSpentInCents;

        // compare with tier rules from highest spent to lowest:
        tierRules.sort((a, b) => (b.minSpentInCents - a.minSpentInCents));
        for(const tierRule of tierRules) {
            if (customer.calcSpentInCents >= tierRule.minSpentInCents) {
                customer.currentTierId = tierRule.id;
                break;
            }
        }
        return customer;
    }

    /**
     * This is to convert a customer object to a view model with appended properties according to tier rules.
     * @param customer a Customer object
     * @returns a CustomerVM object
     */
    private async decorateToVM(customer: Customer): Promise<CustomerVM> {
        const customerVM = new CustomerVM(customer);
        const tierRules = await this.tierRuleRepository.getAll();
        // sort the tier rules by spent requirement
        tierRules.sort((a, b) => (b.minSpentInCents - a.minSpentInCents));
        let currentTier: TierRule = null;
        let previousHigherRule: TierRule = null;
        for(const tierRule of tierRules) {
            if (customer.currentTierId === tierRule.id) {
                currentTier = tierRule;
                customerVM.currentTierName = tierRule.name;
                if (previousHigherRule !== null) {
                    customerVM.nextTierName = previousHigherRule.name;
                    customerVM.nextTierGapInCents = previousHigherRule.minSpentInCents - tierRule.minSpentInCents;
                } else {
                    customerVM.nextTierName = null;
                    customerVM.nextTierGapInCents = 0;
                }
                break;
            } else {
              previousHigherRule = tierRule;
            }
        }

        // get this year spent in cents, and update the customer view model
        const totalSpentInCents: number = await this.getThisYearSpentTotalInCents(customer.id);
        customerVM.thisYearSpentInCents = totalSpentInCents;
        let thisYearTier: TierRule = null;
        for(const tierRule of tierRules) {
            if (customerVM.thisYearSpentInCents >= tierRule.minSpentInCents) {
                thisYearTier = tierRule;
                break;
            }
        }
        customerVM.downgradeDate = dbDateTimeUtil.toDate(dbDateTimeUtil.getUTCEndOfThisYear());
        if (thisYearTier !== null && thisYearTier.minSpentInCents < currentTier.minSpentInCents) {
            customerVM.downgradeTierName = thisYearTier.name;
            customerVM.downgradeGapInCents = currentTier.minSpentInCents - customerVM.thisYearSpentInCents;
        } else {
            customerVM.downgradeTierName = null;
            customerVM.downgradeGapInCents = 0;
        }
        return customerVM;
    }

    getLastYearSpentTotalInCents(customerId: string): Promise<number> {
        const fullYear: number = new Date().getUTCFullYear() - 1;
        return this.getAnnualSpentTotalInCents(customerId, fullYear);
    }

    getThisYearSpentTotalInCents(customerId: string): Promise<number> {
        const fullYear: number = new Date().getUTCFullYear();
        return this.getAnnualSpentTotalInCents(customerId, fullYear);
    }

    getAnnualSpentTotalInCents(customerId: string, fullYear: number): Promise<number> {
        const fromDate = dbDateTimeUtil.getUTCStartOfYear(fullYear);
        const toDate = dbDateTimeUtil.getUTCEndOfYear(fullYear);
        return this.orderRepository.getOrdersTotalByCustomerId(customerId, fromDate, toDate);
    }
}
