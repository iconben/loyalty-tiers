import { debug } from 'console';
import { Customer } from '../models/customer';
import { dbDateTimeUtil } from '../utilities/dbDateTimeUtil';
import { AbstractRepository } from './abstract-repository';

export class CustomerRepository extends AbstractRepository {
  constructor() {
    super();
  }

  async saveIfNotExists(customer: Customer): Promise<any> {
    const result = await this.query(`
      INSERT IGNORE INTO \`customer\` (id, name, current_tier_id, calc_from_date, calc_to_date, calc_spent_in_cents)
      VALUES ('${customer.id}', '${customer.name}', ${customer.currentTierId}, '${dbDateTimeUtil.fromDate(customer.calcFromDate)}', '${dbDateTimeUtil.fromDate(customer.calcToDate)}', ${customer.calcSpentInCents});
      `
    );
    return Promise.resolve(result[0]);
  }

  async update(customer: Customer): Promise<any> {
    const result = await this.query(`
      UPDATE \`customer\`
      SET name = '${customer.name}',
          current_tier_id = ${customer.currentTierId},
          calc_from_date = '${dbDateTimeUtil.fromDate(customer.calcFromDate)}',
          calc_to_date = '${dbDateTimeUtil.fromDate(customer.calcToDate)}',
          calc_spent_in_cents = ${customer.calcSpentInCents}
      WHERE id = '${customer.id}';
      `
    );
    debug(`Updated customer ${JSON.stringify(customer)}`);
    return Promise.resolve(result[0]);
  }

  async getCustomerById(customerId: string): Promise<Customer> {
    const result = await this.query(
      `SELECT id, name,
      current_tier_id AS currentTierId,
      calc_from_date AS calcFromDate,
      calc_to_date AS calcToDate,
      calc_spent_in_cents AS calcSpentInCents
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