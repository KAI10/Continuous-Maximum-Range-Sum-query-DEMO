var express = require('express');
var router = express.Router();

function getLocation(locations, time){
	if(locations.length == 0 || time < locations[0].time || time > locations[locations.length-1].time){
		//console.log('invalid');
		return {lat: 1000, lng: 1000, pos: -1};
	}
	var lat, lng, Dt, dt, plat, plng, nlat, nlng;
	var left = 0, right = locations.length - 1, mid;
	while(left <= right){
		mid = parseInt((left + right)/2);
		if(locations[mid].time == time){
			//console.log(locations[mid]);
			return {lat: locations[mid].lat, lng: locations[mid].lng};
		}
		else if(locations[mid].time < time) left = mid+1;
		else right = mid-1;
	}
	if(locations[mid].time < time) mid++;
	//console.log(locations[mid]);
	
	Dt = locations[mid].time - locations[mid-1].time, dt = time - locations[mid-1].time;
	plat = locations[mid-1].lat, nlat = locations[mid].lat;
	plng = locations[mid-1].lng, nlng = locations[mid].lng;

	pos = mid;
	lat = plat + (nlat - plat) * (dt / Dt), lng = plng + (nlng - plng) * (dt / Dt);
	return {lat: lat, lng: lng, pos: pos};
}

function getSolution(solutions, time){
	/**/
	if(time < solutions[0].startTime || time > solutions[solutions.length-1].endTime){
		return "NULL";
	}

	for(var i=0; i<solutions.length; i++){
		if(solutions[i] == null) continue;
		if(time >= solutions[i].startTime && time <= solutions[i].endTime){
			return solutions[i].items;
		}
	}
}

function getObjectLocation(data, id, time){
	for(var i=0; i<data.length; i++){
		if(data[i].id == id){
			return getLocation(data[i].locations, time);
		}
	}
}

function getMBRcenter(data, items, time){
	
	if(items == null) return null;
	var minLat = 1000, maxLat = -minLat, minLng = minLat, maxLng = maxLat;
	for(var ob=0; ob<items.length; ob++){
		var id = items[ob];
		var part = id % 10;

		loc = getObjectLocation(data[part].objects, id, time);
		//console.log('loc: ', loc);
		minLat = Math.min(minLat, loc.lat);
        maxLat = Math.max(maxLat, loc.lat);

        minLng = Math.min(minLng, loc.lng);
        maxLng = Math.max(maxLng, loc.lng);
	}		

	return {lat : (minLat + maxLat)/2, lng : (minLng + maxLng)/2};	
}

function setup3D(data, solutions, startTime, endTime){
	/**/
	//data.add({x:5, y:10, z:0});
	var ret = [];
	var mbrCenter;

	var solution = getSolution(solutions, startTime);

	//console.log(solution);
	mbrCenter = getMBRcenter(data, solution, startTime);

	console.log(mbrCenter);
	ret.push({x: mbrCenter.lat, y: mbrCenter.lng, z: startTime});

	var lastEndTime, lastIndex;
	for(var i=0; i<solutions.length; i++){

		if(solutions[i] == null) continue;
		if(solutions[i].startTime >= endTime) break;
		if(solutions[i].endTime < startTime) continue;

		lastIndex = i;
		lastEndTime = solutions[i].endTime;

		mbrCenter = getMBRcenter(data, solutions[i].items, solutions[i].startTime);
		if(mbrCenter != null){
			ret.push({x: mbrCenter.lat, y: mbrCenter.lng, z: solutions[i].startTime});
		}
	}

	mbrCenter = getMBRcenter(data, solutions[lastIndex].items, solutions[lastIndex].endTime);
	if(mbrCenter != null){
		ret.push({x: mbrCenter.lat, y: mbrCenter.lng, z: endTime});
	}
	
	return ret;
}

/* GET users listing. */
router.get('/:name/:startTime/:endTime/:qSize', function(req, res, next) {

	var address = null;
	if(req.params.name == 'newData') address = '../public/data/'+req.params.name+'.json';
	else address = '../public/data/'+req.params.name+ '_' + req.params.qSize +'.json'
	var result = require(address);

	var data = [];
	for(var part = 0; part < 10; part++){
		var address = '../public/data/'+req.params.name+'_locations_'+part.toString()+'.json';

		data.push(require(address));
		//console.log(part.toString()+' complete.');
	}

	ret = setup3D(data, result.solutions, parseFloat(req.params.startTime), parseFloat(req.params.endTime));
	ret.sort(function(a, b){return a.z - b.z});
	console.log(ret);
	console.log('ret size: ', ret.length);


	//res.send('showing 3D');
	res.render('show3D', {
		title: 'COMAXRS-DEMO',
		Data: ret,
		dataset: req.params.name,
		startTime: req.params.startTime,
		endTime: req.params.endTime,
		qSize: req.params.qSize
	});

});

module.exports = router;
