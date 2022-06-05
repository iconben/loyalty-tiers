var express = require('express');
var router = express.Router();
var customerRepository = require('../repositories/customer');
var orderRepository = require('../repositories/order');

/**
 * @api {get} /customers/:id 
 * @description Get a customer with spent stats
 * @param {*} customerId the customer id
 * @returns a customer with spent stats
 */
router.get('/:customerId', function(req, res, next) {
  customerRepository.getCustomerWithStats(req.params.customerId).then(function(result) {
    res.send(result);
  }).catch(function(err) {
    res.status(500).send({
      Message: 'Query failed.',
      error: err});
  });
});

/**
 * @api {get} /customers/:id/orders
 * @description Get a customer's orders since the start of last year
 * @param {*} customerId the customer id
 * @returns a list of orders ordered by date desc
 */
router.get('/:customerId/orders', function(req, res, next) {
  //calculate the start time of last year day 1
  let startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  startDate.setMonth(0);
  startDate.setDate(1);
  startDate = startDate.getTime();

  //get the orders of the customer and return
  orderRepository.getCustomerOrders(req.params.customerId, startDate).then(function(result) {
    res.send(result);
  }).catch(function(err) {
    res.status(500).send({
      Message: 'Query failed.',
      error: err});
  });
});

module.exports = router;
