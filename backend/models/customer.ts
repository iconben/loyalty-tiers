export interface ICustomer {
    id: string;
    name: string;
    currentTierId: number;
    calcStartDate: Date;
}

export class Customer {
    id: string;
    name: string;
    currentTierId: number;
    calcStartDate: Date;

    constructor(id: string, name: string, currentTierId: number, calcStartDate: Date) {
        this.id = id;
        this.name = name;
        this.currentTierId = currentTierId;
        this.calcStartDate = calcStartDate;
    }
}