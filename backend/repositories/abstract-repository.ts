import mysql from 'mysql2/promise';
import { Config } from '../config/config';

export class AbstractRepository {

  async execute(sql: any, params?: any): Promise<any> {
    const connection = await mysql.createConnection(Config.db);
    if (params) {
      return connection.execute(sql, params);
    } else {
      return connection.execute(sql);
    }
  }

  async query(sql: any, params?: any): Promise<any> {
    const connection = await mysql.createConnection(Config.db);
    if (params) {
      return connection.query(sql, params);
    } else {
      return connection.query(sql);
    }
  }
}