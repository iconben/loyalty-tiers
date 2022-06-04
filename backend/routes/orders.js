var express = require('express');
var router = express.Router();

/* POST a completed order. */
router.post('/', function(req, res, next) {
  res.send('result of saving order.');
});

module.exports = router;
