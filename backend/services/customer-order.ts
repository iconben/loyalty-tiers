import { debug } from 'console';
import { Customer } from '../models/customer';
import { IOrder } from '../models/order';
import { CustomerRepository } from '../repositories/customer-repository';
import { OrderRepository } from '../repositories/order-repository';
import { dbDateTimeUtil } from '../utilities/dbDateTimeUtil';

export class CustomerOrderService {
    constructor(private orderRepository: OrderRepository, private customerRepository: CustomerRepository) {}

    async saveOrder(order: IOrder): Promise<any> {
        await this.orderRepository.save(order);
        const customer = new Customer(order.customerId, order.customerName, 1);
        // this.getAnnualSpentTotalInCents(order.customerId, new Date(order.date).getFullYear()).then(totalInCents => {
        //     debug('totalInCents: ' + totalInCents);
        // });
        return this.customerRepository.saveIfNotExists(customer);
    }

    async getCustomerWithStats(customerId: string): Promise<any> {
        const customer = await this.customerRepository.getCustomerById(customerId);
        if (customer === null) {
            return Promise.resolve(null);
        }
        const totalSpent = await this.getLastYearSpentTotalInCents(customerId);
        customer.totalSpent = totalSpent;
        debug(`totalSpent: ${totalSpent}`);
        return Promise.resolve(customer);
    }

    getLastYearSpentTotalInCents(customerId: string): Promise<number> {
        const fullYear: number = new Date().getUTCFullYear() - 1;
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