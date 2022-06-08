import { Customer } from "../models/customer";

export class CustomerVM extends Customer {
    currentTierName: string;
    nextTierName: string;
    nextTierGapInCents: number;
    thisYearSpentInCents: number;
    downgradeTierName: string;
    downgradeDate: Date;
    downgradeGapInCents: number;

    constructor (customer: Customer) {
        super(customer.id, customer.name, customer.currentTierId, customer.calcFromDate, customer.calcToDate, customer.calcSpentInCents);
    }
}