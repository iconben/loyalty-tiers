import { AbstractRepository } from './abstract-repository';
import { TierRule } from '../models/tier-rule';

export class TierRuleRepository extends AbstractRepository {
  // This is to cache the tier rules in memory.
  private static tierRules: TierRule[] = null;

  constructor() {
    super();
  }

  async getAll(): Promise<TierRule[]> {
    if (TierRuleRepository.tierRules !== null) {
      return Promise.resolve(TierRuleRepository.tierRules);
    }

    const result = await this.query(`
      SELECT id, name, min_spent_in_cents AS minSpentInCents, description
      FROM tier_rule
      `
    );
    TierRuleRepository.tierRules = result[0];
    return Promise.resolve(TierRuleRepository.tierRules);
  }
}