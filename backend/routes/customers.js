var express = require('express');
var router = express.Router();

/* GET a customers. */
router.get('/:customerId', function(req, res, next) {
  res.send('respond with customer ' + req.params.customerId);
});

router.get('/:customerId/orders', function(req, res, next) {
  res.send('respond with orders for customer ' + req.params.customerId);
});

module.exports = router;
