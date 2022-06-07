import { ICustomer } from '../models/customer';
import { AbstractRepository } from './abstract-repository';
import { OrderRepository } from './order-repository';

export class CustomerRepository extends AbstractRepository {
  constructor() {
    super();
  }

  async saveIfNotExists(customer: ICustomer): Promise<any> {
    const result = await this.query(`
      INSERT IGNORE INTO \`customer\` (id, name, current_tier_id, spent_from_date, spent_to_date, spent_in_cents)
      VALUES ('${customer.id}', '${customer.name}', ${customer.currentTierId}, '${customer.spentFromDate}', '${customer.spentToDate}', ${customer.spentInCents});
      `
    );
    return Promise.resolve(result[0]);
  }

  async getCustomerById(customerId: string): Promise<any> {
    const result = await this.query(
      `SELECT id, name,
      current_tier_id AS currentTierId,
      spent_from_date AS calcStartDate,
      spent_to_date AS calcEndDate,
      spent_in_cents AS spentInCents
      FROM customer
      WHERE id = '${customerId}'
      `
    );
    if (result[0].length === 0) {
      return Promise.resolve(null);
    }
    return Promise.resolve(result[0][0]);
  };
}