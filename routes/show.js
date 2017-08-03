var express = require('express');
var router = express.Router();
var fs = require('fs');
var sizeof = require('object-sizeof');

var config = require('../public/javascripts/config.js');

function getIndex(locations, time){

	var left = 0, right = locations.length-1, mid;
	while(left <= right){
		mid = parseInt((left + right)/2);
		if(locations[mid].time == time) return mid;
		if(locations[mid].time < time) left = mid + 1;
		else right = mid - 1;
	}

	if(locations[mid].time < time) mid++;
	return mid;
}


function filter(address, startTime, endTime){
	
	startTime = startTime - 300, endTime = endTime + 300;

	var data = require(address);
	console.log('before: ', sizeof(data));

	//var count = 0;
	for(var i=0; i<data.objects.length;){
		/*
		for(var l=0; l<data.objects[i].locations.length;){
			//console.log(data.objects[i].locations[l].time);
			if(data.objects[i].locations[l].time < startTime || data.objects[i].locations[l].time > endTime){
				//count++;
				data.objects[i].locations.splice(l, 1);
			}
			else l++;
		}
		*/
		var len = data.objects[i].locations.length;
		var startIndex = getIndex(data.objects[i].locations, startTime);
		var endIndex = getIndex(data.objects[i].locations, endTime);

		data.objects[i].locations.splice(endIndex+1, len - endIndex - 1);
		data.objects[i].locations.splice(0, startIndex);
		
		if(data.objects[i].locations.length == 0) data.objects.splice(i, 1);
		else i++;
	} 

	console.log('after: ', sizeof(data));
	return data;
}

/* GET Map page. */
router.get('/:name/:startTime/:endTime', function(req, res, next) {

	console.log('dataset: ', req.params.name);
	console.log('start: ', req.params.startTime);
	console.log('end: ', req.params.endTime);

	// ***** filter data with startTime and endtime ******

	var startTime = req.params.startTime;
	var endTime = req.params.endTime;

	var result = require('../public/data/'+req.params.name+'.json');
	
	//read data from multiple jsons
	var data = [];
	for(var part = 0; part < 10; part++){
		var address = '../public/data/'+req.params.name+'_locations_'+part.toString()+'.json';
		var timeFiltered = filter(address, parseInt(startTime), parseInt(endTime));

		var localPath = './public/log'+part.toString()+'.json';
		var body = JSON.stringify(timeFiltered);
		fs.writeFile(localPath,body,function(err){});

		data.push(timeFiltered);
		console.log(part.toString()+' complete.');
	}

	console.log(sizeof(data));

	res.render('show', {
		title: 'COMAXRS-DEMO',
		result: result,
		data: data,
		startTime: startTime,
		endTime: endTime,
		api_url: config.api_url
	});
});

module.exports = router;