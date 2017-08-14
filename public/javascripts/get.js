function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

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

function getMapProperties(data, result, time){

	var solution = getSolution(result.solutions, time);
	var locations = {};

	var minLat = 1000, maxLat = -minLat, minLng = minLat, maxLng = maxLat;

	var count = 0;
	for(var part=0; part<10; part++){
		if(data[part].objects == null) continue;

		for(var i=0; i<data[part].objects.length; i++){
		    var id = data[part].objects[i].id,
		        loc = getLocation(data[part].objects[i].locations, time);
		    
		    if(loc.pos != -1){
		        if(solution.includes(id)){
		        	console.log(id);

			        minLat = Math.min(minLat, loc.lat);
			        maxLat = Math.max(maxLat, loc.lat);

			        minLng = Math.min(minLng, loc.lng);
			        maxLng = Math.max(maxLng, loc.lng);

			        /*
			        count++;
		        	locations[id] = {lat: loc.lat, lng: loc.lng};
		        	*/
		        }
		      
		      	
		      	count++;
		        locations[id] = {lat: loc.lat, lng: loc.lng};
		        
		    }
		    else{
		    	locations[id] = "NULL";
		    }

		}
	}

	console.log('number of objects present: ', count);

	var mbrCenter = {lat : (minLat + maxLat)/2, lng : (minLng + maxLng)/2};
	return {center: mbrCenter, locations: locations};
}
