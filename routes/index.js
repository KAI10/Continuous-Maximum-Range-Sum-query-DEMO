var express = require('express');
var router = express.Router();
var result = require('../public/javascripts/3984.json');
var data = require('../public/javascripts/3984_locations.json');
var config = require('../public/javascripts/config.js');
//var parameters = require('../public/javascripts/parameters')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'COMAXRS-DEMO',
  	result: result,
  	data: data,
  	api_url: config.api_url
  });
});

module.exports = router;
