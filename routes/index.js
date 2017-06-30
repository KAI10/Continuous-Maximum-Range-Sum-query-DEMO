var express = require('express');
var router = express.Router();
var data = require('../3984.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'Express',
  	result: data
  });
});

module.exports = router;
