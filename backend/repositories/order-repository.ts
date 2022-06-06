import { AbstractRepository } from './abstract-repository';
import { IOrder } from '../models/order';
import debug from 'debug';
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
  save(order: IOrder): Promise<any> {
    debug('timestamp of order:' + new Date(order.date).getTime());
    const timestamp = this.getTimestampString(new Date(order.date));
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
   * @param {*} startDate the start date timestamp
   * @returns an order list
   */
  async getCustomerOrders(customerId: string, startDate: number): Promise<any> {
    const result: RowDataPacket[] = await this.query(`
      SELECT order_id AS orderId, date, total_in_cents AS totalInCents
      FROM \`order\`
      WHERE customer_id = ${customerId}
      AND date >= ${startDate}
      ORDER BY date DESC;`
    )
    return Promise.resolve(result[0]);
  }

  private getTimestampString(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ') + '.' + date.getUTCMilliseconds();
  }
}