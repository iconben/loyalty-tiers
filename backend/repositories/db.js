const mysql = require('mysql2/promise');
const config = require('../config');

async function createDatabase() {
  const sql = `
    CREATE DATABASE IF NOT EXISTS ${config.db.database};

    USE ${config.db.database};

    CREATE TABLE IF NOT EXISTS customer_order (
      order_id varchar(50) NOT NULL,
      customer_id varchar(50) NOT NULL,
      customer_name varchar(50) NOT NULL,
      total_in_cents int(11) NOT NULL,
      date timestamp NOT NULL,
      PRIMARY KEY (order_id)
    );

    CREATE INDEX IF NOT EXISTS customer_order_customer_id_index ON customer_order (customer_id);

    CREATE TABLE IF NOT EXISTS loyalty_policy (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(50) NOT NULL,
      min_total_spent_in_cents INT NOT NULL,
      description VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
    );

    INSERT IGNORE INTO loyalty_policy (id, name, min_total_spent_in_cents, description) VALUES (1, 'Bronze', 0, 'default tier, from $0 spent');
    INSERT IGNORE INTO loyalty_policy (id, name, min_total_spent_in_cents, description) VALUES (2, 'Silver', 10000, 'at least $100 spent since the start of last year');
    INSERT IGNORE INTO loyalty_policy (id, name, min_total_spent_in_cents, description) VALUES (3, 'Gold', 50000, 'at least $500 spent since the start of last year');

    CREATE TABLE IF NOT EXISTS customer (
      id varchar(50) NOT NULL,
      name varchar(50) NOT NULL,
      current_tier_id int(11) NOT NULL,
      calc_start_date timestamp,
      PRIMARY KEY (id)
    );

    CREATE TABLE IF NOT EXISTS customer_loyalty_tier_log (
      id int(11) NOT NULL AUTO_INCREMENT,
      customer_id varchar(50) NOT NULL,
      customer_name varchar(50) NOT NULL,
      tier_id int(11) NOT NULL,
      tier_name varchar(50) NOT NULL,
      calc_start_date timestamp NOT NULL,
      date timestamp NOT NULL,
      PRIMARY KEY (id)
    );
  `;

  const dbConfig = Object.assign({}, config.db);
  dbConfig.database = '';
  dbConfig.multipleStatements = true;
  const connection = await mysql.createConnection(dbConfig);
  const [results, ] = await connection.query(sql);

  return results;
}

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  createDatabase,
  query
}