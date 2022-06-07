export interface IOrder {
    orderId: string;
    customerId: string;
    customerName: string;
    totalInCents: number;
    date: string;
}

export class Order implements IOrder {
    orderId: string;
    customerId: string;
    customerName: string;
    totalInCents: number;
    date: string;
    dateTimestamp: number;

    constructor(orderId: string, customerId: string, customerName: string, totalInCents: number, date: string) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.totalInCents = totalInCents;
        this.date = date;
    }
}