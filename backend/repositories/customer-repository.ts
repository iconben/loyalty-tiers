import { debug } from 'console';
import { RowDataPacket } from 'mysql2';
import { ICustomer } from '../models/customer';
import { AbstractRepository } from './abstract-repository';

export class CustomerRepository extends AbstractRepository {
  constructor() {
    super();
  }

  async saveIfNotExists(customer: ICustomer): Promise<any> {
    const result = await this.query(`
      INSERT IGNORE INTO \`customer\` (id, name, current_tier_id, calc_start_date)
      VALUES ('${customer.id}', '${customer.name}', ${customer.currentTierId}, '${customer.calcStartDate}');
      `
    );
    return Promise.resolve(result[0]);
  }

  async getCustomerWithStats(customerId: string): Promise<any> {
    const result = await this.query(
      `SELECT id, name,
      current_tier_id AS currentTierId,
      calc_start_date AS calcStartDate
      FROM customer
      WHERE id = ${customerId}
      `
    );
    if (result[0].length === 0) {
      return Promise.resolve(null);
    } else {
      return Promise.resolve(result[0][0]);
    }
  };
}