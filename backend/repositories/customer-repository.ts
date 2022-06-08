import { debug } from 'console';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Customer } from '../models/customer';
import { dbDateTimeUtil } from '../utilities/dbDateTimeUtil';
import { AbstractRepository } from './abstract-repository';

export class CustomerRepository extends AbstractRepository {
  constructor() {
    super();
  }

  async saveIfNotExists(customer: Customer): Promise<ResultSetHeader> {
    const result = await this.query(`
      INSERT IGNORE INTO \`customer\` (id, name, current_tier_id, calc_from_date, calc_to_date, calc_spent_in_cents)
      VALUES ('${customer.id}', '${customer.name}', ${customer.currentTierId}, '${dbDateTimeUtil.fromDate(customer.calcFromDate)}', '${dbDateTimeUtil.fromDate(customer.calcToDate)}', ${customer.calcSpentInCents});
      `
    );
    return Promise.resolve(result[0] as ResultSetHeader);
  }

  async update(customer: Customer): Promise<ResultSetHeader> {
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
    return Promise.resolve(result[0] as ResultSetHeader);
  }

  async updateAll(customers: Customer[]): Promise<ResultSetHeader> {
    const query = customers.map(customer => `
      UPDATE \`customer\`
      SET name = '${customer.name}',
          current_tier_id = ${customer.currentTierId},
          calc_from_date = '${dbDateTimeUtil.fromDate(customer.calcFromDate)}',
          calc_to_date = '${dbDateTimeUtil.fromDate(customer.calcToDate)}',
          calc_spent_in_cents = ${customer.calcSpentInCents}
      WHERE id = '${customer.id}';
      `
    );
    const result = await this.query(query.join('\n'), null, true);
    if(result[0] instanceof Array) {
      const resultList = result[0] as unknown as ResultSetHeader[];
      const resultTotal = resultList[0];
      for (let i= 1; i < resultList.length; i++) {
        resultTotal.affectedRows += resultList[i].affectedRows;
        resultTotal.changedRows += resultList[i].changedRows;
      }
      return Promise.resolve(resultTotal as ResultSetHeader);
    } else {
      return Promise.resolve(result[0] as ResultSetHeader);
    }
  }

  async getAllCustomerIds(): Promise<string []> {
    const result = await this.query(`
      SELECT id FROM customer ORDER BY id;
    `)
    const customers = result[0] as Customer[];
    return Promise.resolve(customers.map(customer => customer.id));
  }

  async getCustomersByIds(customerIds: string[]): Promise<Customer[]> {
    const query = customerIds.join('\',\'');
    const result = await  this.query(`
    SELECT id, name,
      current_tier_id AS currentTierId,
      calc_from_date AS calcFromDate,
      calc_to_date AS calcToDate,
      calc_spent_in_cents AS calcSpentInCents
      FROM customer
      WHERE id IN (\'${query}\');
    `);
    return Promise.resolve(result[0] as Customer[]);
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

    const customers = result[0] as Customer[];
    if (customers.length === 0) {
      return Promise.resolve(null);
    }
    return Promise.resolve(result[0][0]);
  };
}