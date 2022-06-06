export interface IOrder {
    orderId: string;
    customerId: string;
    customerName: string;
    totalInCents: number;
    date: Date;
}

export class Order implements IOrder {
    orderId: string;
    customerId: string;
    customerName: string;
    totalInCents: number;
    date: Date;
    dateTimestamp: number;

    constructor(orderId: string, customerId: string, customerName: string, totalInCents: number, date: Date) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.totalInCents = totalInCents;
        this.date = date;
    }
}