import { AbstractRepository } from './abstract-repository';
import { Order } from '../models/order';
import { debug } from 'console';
import { dbDateTimeUtil } from '../utilities/dbDateTimeUtil';
import { RowDataPacket } from 'mysql2';

export class OrderRepository extends AbstractRepository {
  constructor() {
    super();
  }

  /**
   * Save an order
   * @param order the order to save
   * @returns status code 201 if success
   */
  save(order: Order): Promise<any> {
    const timestamp = dbDateTimeUtil.fromISOString(order.date);
    return this.execute(
      `INSERT INTO \`order\` (order_id, customer_id, customer_name, total_in_cents, date)
      VALUES ('${order.orderId}', '${order.customerId}', '${order.customerName}', ${order.totalInCents}, '${timestamp}');
      `
    );
  }

  /**
   * Get the customer's orders since a start date
   * ordered by date desc
   * @param {*} customerId the customer id
   * @param {*} fromDate the start date time in db format (YYYY-MM-DD HH:MM:SS.ms)
   * @returns an order list
   */
  async getCustomerOrders(customerId: string, fromDate: string): Promise<any> {
    const result: RowDataPacket[] = await this.query(`
      SELECT order_id AS orderId, customer_id AS customerId, customer_name AS customerName, date, total_in_cents AS totalInCents
      FROM \`order\`
      WHERE customer_id = '${customerId}'
      AND date >= '${fromDate}'
      ORDER BY date DESC;
      `
    )
    return Promise.resolve(result[0]);
  }

  /**
   * Get the customer's orders total during a period
   * @param customerId the customer id
   * @param fromDate the start date time in db format (YYYY-MM-DD HH:MM:SS.ms)
   * @param toDate the to date time in db format (YYYY-MM-DD HH:MM:SS.ms)
   * @returns an integer representing the total spent in cents
   */
  async getCustomerOrdersTotalInCents(customerId: string, fromDate: string, toDate: string): Promise<number> {
    const result: RowDataPacket[] = await this.query(`
      SELECT SUM(total_in_cents) AS totalInCents
      FROM \`order\`
      WHERE customer_id = '${customerId}'
      AND date >= '${fromDate}'
      AND date <= '${toDate}';
      `
    )
    return Promise.resolve(result[0][0].totalInCents == null ? 0 : parseInt(result[0][0].totalInCents, 10));
  }

  /**
   * Get the orders total list for many customers during a period
   * @param customerIds the customer id array
   * @param fromDate the start date time in db format (YYYY-MM-DD HH:MM:SS.ms)
   * @param toDate the to date time in db format (YYYY-MM-DD HH:MM:SS.ms)
   * @returns an array of objects with the customer id and the total spent in cents
   */
  async getOrdersTotalByCustomerIds(customerIds: string[], fromDate: string, toDate: string): Promise<any> {
    const customerIdsString = customerIds.join("','");
    const result = await this.query(`
      SELECT customer_id AS customerId, SUM(total_in_cents) AS totalInCents
      FROM \`order\`
      WHERE customer_id IN ('${customerIdsString}')
      AND date >= '${fromDate}'
      AND date <= '${toDate}'
      GROUP BY customer_id;
      `
    );
    return Promise.resolve(result[0]);
  }
}