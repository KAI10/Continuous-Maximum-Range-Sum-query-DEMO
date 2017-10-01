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
	
	startTime = startTime - 600, endTime = endTime + 600;

	var data = require(address);
	console.log('before: ', sizeof(data));

	//var count = 0;
	if(data.objects != null){
		for(var i=0; i<data.objects.length;){
			var len = data.objects[i].locations.length;
			var startIndex = getIndex(data.objects[i].locations, startTime);
			var endIndex = getIndex(data.objects[i].locations, endTime);

			data.objects[i].locations.splice(endIndex+1, len - endIndex - 1);
			data.objects[i].locations.splice(0, startIndex);
			
			if(data.objects[i].locations.length == 0) data.objects.splice(i, 1);
			else i++;
		}
	}

	console.log('after: ', sizeof(data));

	//delete require reference to stop require from caching
	delete require.cache[require.resolve(address)];
	return data;
}

function addSolution(part, startTime, endTime, save){

	//console.log('part: ', part);

	var name, address;
	if(part < 10) name = '0'+part.toString();
	else name = part.toString();

	name = 'SF_part_' + name + '.json';
	address = '../public/data/' + name;

	var data = require(address);
	if(data.solutions[data.solutions.length-1].endTime <= startTime) return false;

	var left = 0, right = data.solutions.length-1, mid;
	while(left <= right){
		mid = parseInt((left + right)/2);
		if(data.solutions[mid].startTime == startTime) break;

		//console.log(data.solutions[mid].startTime);
		if(data.solutions[mid].startTime < startTime) left = mid + 1;
		else right = mid - 1;
	}

	if(mid > 0) mid--;
	//console.log('starting from: ', data.solutions[mid].startTime);

	var complete = false;
	for(var i=mid; i<data.solutions.length; i++){
		var temp = {
			startTime: data.solutions[i].startTime,
			endTime: data.solutions[i].endTime,
			items: data.solutions[i].items
		}

		save.push(temp);
		if(data.solutions[i].endTime >= endTime){
			complete = true;
			break;
		}
	}

	if(complete) return true;

	part++;
	if(part < 10) name = '0'+part.toString();
	else name = part.toString();

	name = 'SF_part_' + name + '.json';
	address = '../public/data/' + name;

	data = require(address);
	for(var i=0; i<data.solutions.length && data.solutions[i].startTime < endTime; i++){
		var temp = {
			startTime: data.solutions[i].startTime,
			endTime: data.solutions[i].endTime,
			items: data.solutions[i].items
		}

		save.push(temp);
	}

	return true;
}

/* GET Map page. */
router.get('/:name/:startTime/:endTime/:qSize', function(req, res, next) {

	console.log('dataset: ', req.params.name);
	console.log('start: ', req.params.startTime);
	console.log('end: ', req.params.endTime);
	console.log('qSize: ', req.params.qSize);

	// ***** filter data with startTime and endtime ******

	var startTime = req.params.startTime;
	var endTime = req.params.endTime;
	var qSize = req.params.qSize;

	var address = null, result;
	if(req.params.name == 'newData'){
		address = '../public/data/'+req.params.name+'.json';
		result = require(address);
	}
	else if(req.params.name != 'SF'){
		address = '../public/data/'+req.params.name+ '_' + qSize +'.json';
		result = require(address);
	}
	
	else{
		//handle segmented solution here
		console.log('SF start');
		var save = [];

		for(var part = 0; part < 16; part++){
			var complete = addSolution(part, startTime, endTime, save);
			if(complete) break;
		}

		result = {solutions: save};
		//console.log(result);
		console.log('SF end');
	}
	/**/
	//read data from multiple jsons
	var data = [];
	for(var part = 0; part < 10; part++){
		var address = '../public/data/'+req.params.name+'_locations_'+part.toString()+'.json';
		var timeFiltered = filter(address, parseInt(startTime), parseInt(endTime));

		data.push(timeFiltered);
		console.log(part.toString()+' complete.');
	}

	console.log(sizeof(data));

	res.render('show', {
		title: 'COMAXRS-DEMO',
		dataset: req.params.name,
		result: result,
		data: data,
		startTime: startTime,
		endTime: endTime,
		qSize: qSize,
		api_url: config.api_url
	});
});

module.exports = router;
