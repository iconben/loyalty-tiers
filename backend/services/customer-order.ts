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

    async saveOrder(order: Order): Promise<any> {
        await this.orderRepository.save(order);
        const customer = new Customer(order.customerId, order.customerName, 1);
        // create a new customer if not exist
        await this.customerRepository.saveIfNotExists(customer);
        // recalculate the customer's loyalty tier
        if ((new Date(order.date).getUTCFullYear() - new Date().getUTCFullYear()) === 1) {
            await this.calcCustomerLoyaltyTier(order.customerId);
        }
    }

    async getCustomerWithStats(customerId: string): Promise<CustomerVM> {
        const customer = await this.customerRepository.getCustomerById(customerId);
        if (customer === null) {
            return Promise.resolve(null);
        }
        const customerVM = this.decorateToVM(customer);
        return Promise.resolve(customerVM);
    }

    calcAllCustomerLoyaltyTiers(): Promise<any> {
        return Promise.resolve(null);
    }

    async calcCustomerLoyaltyTier(customerId: string): Promise<CustomerVM> {
        const customer: Customer = await this.customerRepository.getCustomerById(customerId);
        if (customer === null) {
            return Promise.resolve(null);
        }
        // get last year spent in cents, and update the customer object
        const totalSpentInCents: number = await this.getLastYearSpentTotalInCents(customer.id);
        customer.calcFromDate = dbDateTimeUtil.toDate(dbDateTimeUtil.getUTCStartOfLastYear());
        customer.calcToDate = dbDateTimeUtil.toDate(dbDateTimeUtil.getUTCEndOfLastYear());
        customer.calcSpentInCents = totalSpentInCents;

        // compare with tier rules from highest spent to lowest:
        const tierRules = await this.tierRuleRepository.getAll();
        tierRules.sort((a, b) => (b.minSpentInCents - a.minSpentInCents));
        for(const tierRule of tierRules) {
            if (customer.calcSpentInCents >= tierRule.minSpentInCents) {
                customer.currentTierId = tierRule.id;
                break;
            }
        }
        // update the customer to database
        await this.customerRepository.update(customer);

        const customerVM = this.decorateToVM(customer);
        return customerVM;
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
                    customerVM.nextTierGapInCents = previousHigherRule.minSpentInCents - tierRule.minSpentInCents;
                } else {
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
        debug(`fromDate: ${fromDate}`);
        debug(`toDate: ${toDate}`);
        return this.orderRepository.getCustomerOrdersTotalInCents(customerId, fromDate, toDate);
    }
}
