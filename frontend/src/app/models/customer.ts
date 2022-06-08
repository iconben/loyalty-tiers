export interface Customer {
    id: string;
    name: string;
    currentTierId: number;
    currentTierName: string;
    calcFromDate: Date;
    calcToDate: Date;
    calcSpentInCents: number;
    nextTierName: string;
    nextTierGapInCents: number;
    thisYearSpentInCents: number;
    downgradeTierName: string;
    downgradeDate: Date;
    downgradeGapInCents: number;

    // constructor(id: string, name: string, currentTierId: number, calcFromDate: Date, calcToDate: Date, calcSpentInCents: number = 0) {
    //     this.id = id;
    //     this.name = name;
    //     this.currentTierId = currentTierId;
    //     this.calcFromDate = calcFromDate;
    //     this.calcToDate = calcToDate;
    //     this.calcSpentInCents = calcSpentInCents;
    // }
}
