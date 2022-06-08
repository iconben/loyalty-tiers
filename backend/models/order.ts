export class Order {
    orderId: string;
    customerId: string;
    customerName: string;
    totalInCents: number;
    date: Date;

    constructor(orderId: string, customerId: string, customerName: string, totalInCents: number, date: Date) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.totalInCents = totalInCents;
        this.date = date;
    }
}