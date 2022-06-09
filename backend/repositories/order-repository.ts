import { AbstractRepository } from './abstract-repository';
import { Order } from '../models/order';
import { debug } from 'console';
import { dbDateTimeUtil } from '../utilities/dbDateTimeUtil';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Pageable } from './pageable';
import { Page } from './page';

export class OrderRepository extends AbstractRepository {
  constructor() {
    super();
  }

  /**
   * Save an order
   * @param order the order to save
   * @returns status code 201 if success, with result in the body
   */
  async save(order: Order): Promise<ResultSetHeader | any> {
    const timestamp = dbDateTimeUtil.fromDate(order.date);
    const result = await this.execute(
      `INSERT INTO \`order\` (order_id, customer_id, customer_name, total_in_cents, date)
      VALUES ('${order.orderId}', '${order.customerId}', '${order.customerName}', ${order.totalInCents}, '${timestamp}');
      `
    );
    return Promise.resolve(result[0]);
  }

  /**
   * Get the customer's orders since a start date.
   * @param {*} customerId the customer id.
   * @param {*} fromDate the start date time in db format (YYYY-MM-DD HH:MM:SS.ms).
   * @returns an order list ordered by date desc.
   */
  async getAllByCustomerId(customerId: string, fromDate: string, pageable?: Pageable): Promise<Order[] | Page<Order>> {
    const pageCondition = pageable && pageable.isPaged() ? ` LIMIT ${pageable.getSize()} OFFSET ${pageable.getPage() * pageable.getSize()} ` : '';
    const result = await this.query(`
      SELECT order_id AS orderId, customer_id AS customerId, customer_name AS customerName, date, total_in_cents AS totalInCents
      FROM \`order\`
      WHERE customer_id = '${customerId}'
      AND date >= '${fromDate}'
      ORDER BY date DESC
      ${pageCondition};
      `
    );
    let orders: Order[] | Page<Order> = result[0] as Order[];
    if (pageable && pageable.isPaged()) {
      // Get the total count if the pageable is paged
      const totalResult = await this.query(`
        SELECT COUNT(*) AS count
        FROM \`order\`
        WHERE customer_id = '${customerId}'
        AND date >= '${fromDate}'
        `
      );
      const totalCount = totalResult[0][0].count == null ? 0 : parseInt(totalResult[0][0].count, 10)
      orders = new Page<Order>(pageable, orders, totalCount);
    }
    return Promise.resolve(orders);
  }

  async getOrdersTotalByCustomerId(customerId: string, fromDate: string): Promise<number>;
  /**
   * Get the customer's orders total during a period
   * @param customerId the customer id
   * @param fromDate the start date time in db format (YYYY-MM-DD HH:MM:SS.ms)
   * @param toDate the to date time in db format (YYYY-MM-DD HH:MM:SS.ms)
   * @returns an integer representing the total spent in cents
   */
  async getOrdersTotalByCustomerId(customerId: string, fromDate: string, toDate?: string): Promise<number> {
    let query = `
      SELECT SUM(total_in_cents) AS totalInCents
      FROM \`order\`
      WHERE customer_id = '${customerId}'
      AND date >= '${fromDate}'
      `;
    if (toDate) {
      query = query.concat(` AND date <= '${toDate}'`);
    }
    const result = await this.query(query);
    return Promise.resolve(result[0][0].totalInCents == null ? 0 : parseInt(result[0][0].totalInCents, 10));
  }

  async getOrdersTotalByCustomerIds(customerIds: string[], fromDate: string): Promise<any>;
  /**
   * Get the orders total list for many customers during a period
   * @param customerIds the customer id array
   * @param fromDate the start date time in db format (YYYY-MM-DD HH:MM:SS.ms)
   * @param toDate the to date time in db format (YYYY-MM-DD HH:MM:SS.ms)
   * @returns an array of objects with the customer id and the total spent in cents
   */
  async getOrdersTotalByCustomerIds(customerIds: string[], fromDate: string, toDate?: string): Promise<any> {
    const customerIdsString = customerIds.join("','");
    const toDateCondition = toDate ? ` AND date <= '${toDate}'` : '';
    const result = await this.query(`
    SELECT customer_id AS customerId, SUM(total_in_cents) AS totalInCents
    FROM \`order\`
    WHERE customer_id IN ('${customerIdsString}')
    AND date >= '${fromDate}'
     ${toDateCondition}
    GROUP BY customer_id;
    `);
    return Promise.resolve(result[0]);
  }
}