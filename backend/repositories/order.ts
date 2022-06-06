import Db from './db';

export class OrderRepository {

  constructor(private db: Db) {}

  /**
   * Get the customer's orders since a start date
   * ordered by date desc, without pagination
   * @param {*} customerId the customer id
   * @param {*} startDate the start date timestamp
   * @returns an order list
   */
  async getCustomerOrders(customerId: string, startDate: number): Promise<any> {
    return this.db.query(`
      SELECT order_id AS orderId, date, total_in_cents AS totalInCents
      FROM customer_order
      WHERE customer_id = ${customerId}
      AND date >= ${startDate}
      ORDER BY date DESC;`
    );
  }
}