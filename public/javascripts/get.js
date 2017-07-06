function getLocation(locations, time, trjIndex){
	
	if(locations.length == 0 || time < locations[0].time || time > locations[locations.length-1].time){
		return {lat: 1000, lng: 1000, pos: -1};
	}

	var lat, lng, Dt, dt, plat, plng, nlat, nlng;
	
	if(trjIndex != -1){
		Dt = locations[trjIndex].time - locations[trjIndex-1].time, dt = time - locations[trjIndex-1].time;
		plat = locations[trjIndex-1].lat, nlat = locations[trjIndex].lat;
		plng = locations[trjIndex-1].lng, nlng = locations[trjIndex].lng;

		lat = plat + (nlat - plat) * (dt / Dt), lng = plng + (nlng - plng) * (dt / Dt);
		return {lat: lat, lng: lng, pos: trjIndex};
	}
	
	var pos;
	for(var i=1; i<locations.length; i++){
		if(time <= locations[i].time){
			Dt = locations[i].time - locations[i-1].time, dt = time - locations[i-1].time;
			plat = locations[i-1].lat, nlat = locations[i].lat;
			plng = locations[i-1].lng, nlng = locations[i].lng;

			pos = i;
			lat = plat + (nlat - plat) * (dt / Dt), lng = plng + (nlng - plng) * (dt / Dt);
			break;
		}
	}

	return {lat: lat, lng: lng, pos: pos};
	//return {lat : 41.6754174, lng : -87.6967882};
}

function getSolution(solutions, time){
	/**/
	if(time < solutions[0].startTime || time > solutions[solutions.length-1].endTime){
		return "NULL";
	}

	for(var i=0; i<solutions.length; i++){
		if(time >= solutions[i].startTime && time <= solutions[i].endTime){
			return solutions[i].items;
		}
	}
}
