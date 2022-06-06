import debug from 'debug';
import { Customer } from '../models/customer';
import { IOrder } from '../models/order';
import { CustomerRepository } from '../repositories/customer-repository';
import { OrderRepository } from '../repositories/order-repository';

export class CustomerOrderService {
    constructor(private orderRepository: OrderRepository, private customerRepository: CustomerRepository) {}

    async saveOrder(order: IOrder): Promise<any> {
        await this.orderRepository.save(order);
        const customer = new Customer(order.customerId, order.customerName, 1, null);
        return this.customerRepository.saveIfNotExists(customer);
    }

    // calculate the start time of last year day 1 from local time
    getLastYearDayOneTime(): number {
        const startDate: Date = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setMonth(0);
        startDate.setDate(1);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        debug(startDate.toLocaleString());
        return startDate.getTime();
    }
}