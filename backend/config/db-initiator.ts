import mysql from 'mysql2/promise';
import { ConnectionOptions } from 'mysql2/typings/mysql';
import { Config } from './config';

export class DbInitiator{
  async createDatabase(): Promise<any> {
    const sql = `
      CREATE DATABASE IF NOT EXISTS ${Config.db.database};

      USE ${Config.db.database};

      CREATE TABLE IF NOT EXISTS \`order\` (
        order_id varchar(50) NOT NULL,
        customer_id varchar(50) NOT NULL,
        customer_name varchar(50) NOT NULL,
        total_in_cents int(11) NOT NULL,
        date datetime(3) NOT NULL,
        PRIMARY KEY (order_id),
        KEY order_customer_id_index (customer_id)
      );

      CREATE TABLE IF NOT EXISTS tier_rule (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        min_spent_in_cents INT NOT NULL,
        description VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
      );

      INSERT IGNORE INTO tier_rule (id, name, min_spent_in_cents, description) VALUES (1, 'Bronze', 0, 'default tier, from $0 spent');
      INSERT IGNORE INTO tier_rule (id, name, min_spent_in_cents, description) VALUES (2, 'Silver', 10000, 'at least $100 spent since the start of last year');
      INSERT IGNORE INTO tier_rule (id, name, min_spent_in_cents, description) VALUES (3, 'Gold', 50000, 'at least $500 spent since the start of last year');

      CREATE TABLE IF NOT EXISTS customer (
        id varchar(50) NOT NULL,
        name varchar(50) NOT NULL,
        current_tier_id int(11) NOT NULL,
        calc_from_date datetime(3),
        calc_to_date datetime(3),
        calc_spent_in_cents INT,
        PRIMARY KEY (id)
      );

      CREATE TABLE IF NOT EXISTS customer_loyalty_tier_log (
        id int(11) NOT NULL AUTO_INCREMENT,
        customer_id varchar(50) NOT NULL,
        customer_name varchar(50) NOT NULL,
        tier_id int(11) NOT NULL,
        tier_name varchar(50) NOT NULL,
        calc_from_date datetime(3) NOT NULL,
        calc_to_date datetime(3) NOT NULL,
        calc_spent_in_cents INT NOT NULL,
        calc_date datetime NOT NULL,
        PRIMARY KEY (id)
      );
    `;

    const dbConfig : ConnectionOptions = Object.assign({}, Config.db);
    dbConfig.database = '';
    dbConfig.multipleStatements = true;
    const connection = await mysql.createConnection(dbConfig);
    return connection.query(sql);
  }
}

export const dbInitiator = new DbInitiator();
