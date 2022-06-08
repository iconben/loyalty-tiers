import { debug } from 'console';
import mysql from 'mysql2/promise';
import { Config } from '../config/config';

export class AbstractRepository {

  async execute(sql: any, params?: any): Promise<[mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader, mysql.FieldPacket[]]> {
    Config.db.multipleStatements = true;
    const connection = await mysql.createConnection(Config.db);
    if (params) {
      return connection.execute(sql, params);
    } else {
      return connection.execute(sql);
    }
  }

  async query(sql: any, params?: any, multipleStatements = false): Promise<[mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader, mysql.FieldPacket[]]> {
    Config.db.multipleStatements = multipleStatements;
    const connection = await mysql.createConnection(Config.db);
    if (params) {
      return connection.query(sql, params);
    } else {
      return connection.query(sql);
    }
  }
}