var express = require('express');
var router = express.Router();
//var parameters = require('../public/javascripts/parameters')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'COMAXRS-DEMO'
  });
});

module.exports = router;
