const db = require('./db');
const config = require('../config');

/**
 * Get the customer's orders since a start date
 * ordered by date desc, without pagination
 * @param {*} customerId the customer id 
 * @param {*} startDate the start date
 * @returns an order list
 */
async function getCustomerOrders(customerId, startDate){
  const rows = await db.query(`
    SELECT order_id AS orderId, date, total_in_cents AS totalInCents
    FROM customer_order
    WHERE customer_id = ${customerId}
    AND date >= ${startDate}
    ORDER BY date DESC;`
  );

  if (!rows) {
    return [];
  }
  return rows;
}

module.exports = {
    getCustomerOrders
}