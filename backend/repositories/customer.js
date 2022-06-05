const db = require('./db');
const config = require('../config');

async function getCustomerWithStats(customerId){
  const rows = await db.query(
    `SELECT id, name
    FROM customer `
  );

  if (!rows) {
    return [];
  }
  return rows;
}

module.exports = {
    getCustomerWithStats
}