import { debug } from 'console';
import mysql from 'mysql2/promise';
import Pool from 'mysql2/typings/mysql/lib/Pool';
import { Config } from '../config/config';

export class AbstractRepository {

  private static _pool: mysql.Pool;

  protected static pool(): mysql.Pool {
    Config.db.multipleStatements = true;
    return this._pool || (this._pool = mysql.createPool(Config.db));
  }

  async execute(sql: any, params?: any): Promise<[mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader, mysql.FieldPacket[]]> {
    if (params) {
      return AbstractRepository.pool().execute(sql, params);
    } else {
      return AbstractRepository.pool().execute(sql);
    }
  }

  async query(sql: any, params?: any, multipleStatements = false): Promise<[mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader, mysql.FieldPacket[]]> {
    debug(params);
    debug(sql);
    if (params) {
      return AbstractRepository.pool().query(sql, params);
    } else {
      return AbstractRepository.pool().query(sql);
    }
  }
}