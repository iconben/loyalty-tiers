var express = require('express');
var router = express.Router();
var db = require('../repositories/db');

// create the database
router.get('/', function(req, res, next) {
  db.createDatabase().then(function(result) {
    res.send({
      Message: 'Query executed successfully.', 
      details: result 
    });
    res.end();
  }).catch(function(err) {
    res.status(500).send({
      Message: 'Query failed.',
      error: err});
  });
});

module.exports = router;
