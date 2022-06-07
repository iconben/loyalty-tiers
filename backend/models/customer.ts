export interface ICustomer {
    id: string;
    name: string;
    currentTierId: number;
    spentFromDate: Date;
    spentToDate: Date;
    spentInCents: number;
}

export class Customer implements ICustomer {
    id: string;
    name: string;
    currentTierId: number;
    spentFromDate: Date;
    spentToDate: Date;
    spentInCents: number;

    constructor(id: string, name: string, currentTierId: number, spentFromDate: Date = null, spentToDate: Date = null, spentInCents: number = 0) {
        this.id = id;
        this.name = name;
        this.currentTierId = currentTierId;
        this.spentFromDate = spentFromDate;
        this.spentToDate = spentToDate;
        this.spentInCents = spentInCents;
    }
}