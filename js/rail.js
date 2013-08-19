var ru_full = {type: "FeatureCollection", features: []};

function plotall(){
	is_stopped = false;
    co_hash = {};
    m_hash = {};
	document.getElementById("clustexplain").style.display = 'block';
	document.getElementById("clustexplain").innerHTML = "Blue is Southbound; Orange is NorthBound";
    d3.json("./php/rail.php", function(json)
    {
		if (is_stopped) return;
        var kk = 0; var cti = 0;
        function railu()
        {
			if (is_stopped) return;
            setTimeout(function(){
                try{
                u_id = json.users[cti].userid
                }
                catch(TypeError) {
					return;
                }
                co = json.users[cti].coords;
                col = json.users[cti].cluster;
                var color = "";
                if (col === 'N') {color = "hsla(33, 100%, 50%, .5)";}
                if (col === 'S') {color = "hsla(184, 83%, 58%, .5)";}
                if (u_id in co_hash){
                    prev = co_hash[u_id].length-1;
                    co_hash[u_id].push(co);
                    if (prev === 0) {
                    	m_hash[u_id] = kk;
                        ru_full.features[m_hash[u_id]] = 
							create_LS(u_id, co_hash[u_id], color);kk++;
                   	}
					try {
					ru_full.features[m_hash[u_id]]
						.geometry.coordinates.push(co);
					}
					catch(TypeError) {
						return;
					}
                } else {
                    co_hash[u_id] = [co];
                }
			if (cti < json.users.length) {
				railu();
				update(ru_full,0,0);
			}
    		else {
				document.getElementById("explain").style.color="Orange";
				document.getElementById("explain").innerHTML="Complete.";
				return;
            }
    		cti += 1;
			if (cti% 20 === 0) clearall();
            if (cti%100==0 && cti>0){
                var cnt = parseInt(100*cti/(json.users.length -2));
                document.getElementById("explain").innerHTML = cnt+" % Complete.";
            }

            }, 1)
        }
        railu();
  	})
}

function plotRailUsers(){
	is_stopped = false;
	var ru_day = {type: "FeatureCollection", features: []};
    var co_hash = {};
    var m_hash = {};
	document.getElementById("explain").style.color="Blue";
    var d = document.getElementById("date2").value;
	document.getElementById("explain").style="lightgrey";
    if (d === ''){ 
	 document.getElementById("explain").style.color="lightgrey";
     document.getElementById("explain").innerHTML = "Fetching data for all dates ...";
	document.getElementById("clustexplain").innerHTML = 
			"Blue is Southbound; Orange is NorthBound";
     plotall();
    }
    else{
     document.getElementById("explain").innerHTML = "Fetching data for " + d + " ...";
     d3.json("./php/rail.php?date="+d, function(json)
     {
		if (is_stopped) return;
		if (json.users.length === 0) {
			document.getElementById("explain").style.color="Red";
			document.getElementById("explain").innerHTML =
				"No rail data for date = " + d +" Choose"+
				" a different date."
		}else{
			document.getElementById("explain").style.color="Green"
			document.getElementById("explain").innerHTML =
				"Found " + json.users.length + " records." +
				" Plotting for date = " + d + " ..."
		}	
		var kk = 0; var cti = 0;
        function railud()
        {
			if (is_stopped) return;
            setTimeout(function(){
                try{
                u_id = json.users[cti].userid
                }
                catch(TypeError) {
                    return;
                }
                co = json.users[cti].coords;
                col = json.users[cti].cluster;
                var color = "";
                if (col === 'N') {color = "hsla(33, 100%, 50%, .5)";}
                if (col === 'S') {color = "hsla(184, 83%, 58%, .5)";}
                if (u_id in co_hash){
                    prev = co_hash[u_id].length-1;
                    co_hash[u_id].push(co);
                    if (prev === 0) {
                        m_hash[u_id] = kk;
                        ru_day.features[m_hash[u_id]] =
                            create_LS(u_id, co_hash[u_id], color);
						kk++;
                    }
					try {
                    ru_day.features[m_hash[u_id]]
                        .geometry.coordinates.push(co);
					}
					catch(TypeError) {
						return;
					}
                } else {
                    co_hash[u_id] = [co];
                }
            if (cti < json.users.length) {
				railud();
				update(ru_day,0,0);
			}
            else {document.getElementById("explain").innerHTML="Complete.";
            }
            cti += 1;
			if (cti%20 === 0) clearall();
            }, 1)
        }
        railud();
     })
   }
}


/*
function create_point(u_id, lo_la, col) {
	var f = {type: "Feature",
			 geometry: {type: "Point",
			 		    "coordinates": lo_la},
			 properties: {"name": u_id,
			 			  "prop0": col}
			};
	return f;
}

*/
