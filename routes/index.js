var express = require('express');
var router = express.Router();
var data = require('../3984.json');
var parameters = require('../public/javascripts/parameters')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'Express',
  	result: data,
  	parameters: parameters
  });
});

module.exports = router;
