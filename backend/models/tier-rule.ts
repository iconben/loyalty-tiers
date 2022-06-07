export class TierRule {
    id: number;
    name: string;
    minSpentInCents: number;
    description: string;
    constructor(id: number, name: string, minSpentInCents: number, description: string) {
        this.id = id;
        this.name = name;
        this.minSpentInCents = minSpentInCents;
        this.description = description;
    }
}