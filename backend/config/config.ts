import { ConnectionOptions, PoolOptions } from "mysql2/typings/mysql";

export class Config {
    static db : ConnectionOptions | PoolOptions = {
      /* should not expose password or any sensitive info, done only for demo */
      host: "localhost",
      user: "root",
      password: "",
      database: "loyalty_tier",
      timezone: "Z",
      connectionLimit: 20,
    }
};