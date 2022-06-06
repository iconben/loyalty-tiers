import Db from './db';

export class CustomerRepository {
  constructor(private db: Db) {}

  async getCustomerWithStats(customerId: string): Promise<any> {
    return this.db.query(
      `SELECT id, name
      FROM customer
      WHERE id = ${customerId}
      `
    ).then((result: any) => {
      if (result == null) {
        return Promise.resolve([]);
      } else {
        return Promise.resolve(result);
      }
    });
  }
}