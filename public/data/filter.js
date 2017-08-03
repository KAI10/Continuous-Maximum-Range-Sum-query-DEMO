var fs = require('fs');
var sizeof = require('object-sizeof');

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

function filter(part){
	/**/

	var addr = './SF_locations_' + part.toString()+'.json';
	var data = require(addr);
	var startTime = 1211690134 - 300, endTime = 1211690134 + 300;

	console.log('before: ', sizeof(data));

	//var count = 0;
	for(var i=0; i<data.objects.length;){
		
		var len = data.objects[i].locations.length;
		var startIndex = getIndex(data.objects[i].locations, startTime);
		var endIndex = getIndex(data.objects[i].locations, endTime);

		data.objects[i].locations.splice(endIndex+1, len - endIndex - 1);
		data.objects[i].locations.splice(0, startIndex);
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
		if(data.objects[i].locations.length == 0) data.objects.splice(i, 1);
		else i++;
	} 

	console.log('after: ', sizeof(data));
	//console.log('count: ', count);
	var body = JSON.stringify(data);
	var localPath = './nlog' + part.toString()+'.json';
	fs.writeFile(localPath,body,function(err){});
}

for(var part = 0; part < 5; part++){
	filter(part);
	console.log(part.toString()+ ' complete.');
}


/*
function getLocation(locations, time){
	if(locations.length == 0 || time < locations[0].time || time > locations[locations.length-1].time){
		console.log('invalid');
		return {lat: 1000, lng: 1000, pos: -1};
	}

	var lat, lng, Dt, dt, plat, plng, nlat, nlng;
	var left = 0, right = locations.length - 1, mid;
	while(left <= right){
		mid = parseInt((left + right)/2);
		if(locations[mid].time == time){
			console.log(locations[mid]);
			return {lat: locations[mid].lat, lng: locations[mid].lng};
		}
		else if(locations[mid].time < time) left = mid+1;
		else right = mid-1;
	}
	if(locations[mid].time < time) mid++;
	console.log(locations[mid]);
}

var data = require('./3984_locations_0.json');
getLocation(data.objects[0].locations, 53.5);
*/