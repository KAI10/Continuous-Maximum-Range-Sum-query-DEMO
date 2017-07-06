var express = require('express');
var router = express.Router();
var result = require('../public/javascripts/3984.json');
var data = require('../public/javascripts/3984_locations.json');
var parameters = require('../public/javascripts/parameters')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'Express',
  	result: result,
  	data: data,
  	parameters: parameters,
  	time: 2700
  });
});

module.exports = router;
