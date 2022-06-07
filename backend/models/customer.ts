export class Customer {
    id: string;
    name: string;
    currentTierId: number;
    calcFromDate: Date;
    calcToDate: Date;
    calcSpentInCents: number;

    constructor(id: string, name: string, currentTierId: number, calcFromDate: Date = null, calcToDate: Date = null, calcSpentInCents: number = 0) {
        this.id = id;
        this.name = name;
        this.currentTierId = currentTierId;
        this.calcFromDate = calcFromDate;
        this.calcToDate = calcToDate;
        this.calcSpentInCents = calcSpentInCents;
    }
}