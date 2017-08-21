var express = require('express');
var router = express.Router();
//var parameters = require('../public/javascripts/parameters')

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'COMAXRS-DEMO',
		dataset: ''
	});
});

router.get('/:dataset', function(req, res, next) {
	//console.log('index.js with new dataset');
	res.render('index', {
		title: 'COMAXRS-DEMO',
		dataset: req.params.dataset
	});
});

module.exports = router;
