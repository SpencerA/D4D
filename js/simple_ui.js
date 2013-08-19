/* Contents:
 * 		Variables: width, height, path, svg, adms, ctry, routes, departs
 *	
 *		Functions: Zooming and Feature Toggles; Random Date Function;
 *				   Random Users function; 
 */
var is_stopped = true;
var width = 600,
    height = 500,
    centered;

var projection = d3.geo.equirectangular()
    .scale(width*7)
    .translate([width*1.2, width*1.35]);

var chart = d3.select("svg")
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height)
                .style("fill-opacity", 0)
                .on('mousemove', myMouseMoveFunction);

	
var path = d3.geo.path()
    .projection(projection)
	.pointRadius(10);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
	.attr("id", "frame")
	.attr("class", "zoomable");
var adms = svg.append("g")
	.attr("id","adms")
	.attr("class","zoomable");
var ctry = svg.append("g")
	.attr("id","ctry")
	.attr("class", "zoomable")
	.on("mouseover",function()
	{
		document.getElementById("explain").style.color="lightgrey";
		d3.select("#explain").text("Click to zoom!");
	})
	;
var departs = svg.append("g")
	.attr("id","departs")
	.attr("class", "zoomable");	

var routes = svg.append("g")
    .attr("id","routes")
    .attr("class", "zoomable");


//global variable positions for zoom context
var x = 0, y = 0, k = 1;

d3.json("./json/CIVoutline.json", function(json)
{			ctry.selectAll("path")
			.data(json.features)
			.enter().append("path")
			.attr("d", path);
});

d3.json("./json/CIVadm1.json", function(json) {
  departs.selectAll("path")
      .data(json.features)
      .enter().append("path")
      .attr("d", path)
	  .style("stroke-opacity", 0)
	  .attr("id","abidjan-city")
      .on("click", click);
	  
	//abidjan zoom circle
	var abidzoomc = {"type" : "Feature",
		"geometry" : { "type" : "Point", "coordinates": [-4.024773,5.344292]},
		"properties" : {
		"prop0" : "value0"
				 }
			}
	departs.append("path")
		.datum({type: "FeatureCollection", features: [abidzoomc]})
		.attr("d", path)
		.style("stroke", "steelblue")
		.style("stroke-opacity", .2)
		.on("click", bigclick); //zoom zoom
	
});
function create_new_feature(coords, u_id)
{
    var f = {type: "Feature",
             geometry: { type: "Point", "coordinates": coords},
             properties: {"name" : u_id}
            };
    return f;
}

function plotRoads(cb) { 
	var col;
	var fi = 'none';
	switch (cb.id) {
		case "roads": col = "gainsboro";  break;
		case "rails": col = "brown";  break;
		case "waterareas": col = "#B0E2FF"; fi = "#B0E2FF"; break;
		default: col = "#B0E2FF"; break;
	}
	if (cb.checked) {
		d3.json("./json/civ"+cb.id+".json", function(json)
		{
			if (x == 0) {
				adms.append("path")
					.datum({type: "FeatureCollection", 
							features: json.features})
					.attr("d", path)
					.style("stroke", col)
					.style("fill", fi)
					.attr("id", cb.id+"viz");
				} else {
				adms.append("path")
                    .datum({type: "FeatureCollection", 
							features: json.features})
                    .attr("d", path)
                    .style("stroke", col)
                    .style("fill", fi)
                    .attr("id", cb.id+"viz")
					.attr("transform", "scale(" + 
						k + ")translate(" + x + "," + y + ")")
                    .style("stroke-width", (1.5 / k) + "px");
				}
				
  		});
	}
	if (!cb.checked) {
		d3.select("#"+cb.id+"viz").remove().transition();
	}
}
//clusters
cls = Array(
{type: "FeatureCollection", features: []},
{type: "FeatureCollection", features: []},
{type: "FeatureCollection", features: []},
{type: "FeatureCollection", features: []}
);

function loadcl(cl, json) {
    for (var j=0; j < json.ants.length; ++j) {
        var f = create_new_feature(json.ants[j].coords, json.ants[j].ant_id);
        cls[cl-1].features.push(f);
    }
}
//antennas helper
function loadants(kp, col, ant) {
        col = typeof col !== 'undefined' ? col : "black";
        d3.json("./php/ant.php?cl="+kp, function(json)
        {
                loadcl(kp, json);
                path = path.pointRadius(1);
				if (x==0){
                adms.append("path")
                    .datum(cls[kp-1])
                    .attr("d", path)
                    .style("stroke", col)
					.style("stroke-opacity", .6)
                    .style("fill", col)
                    .attr("id", ant + kp + col);
					} else {
					 adms.append("path")
                    .datum(cls[kp-1])
                    .attr("d", path)
                    .style("stroke", col)
					.style("stroke-opacity", .6)
                    .style("fill",col)
                    .attr("id", ant + kp + col)
					.attr("transform", "scale(" + 
							k + ")translate(" + x + "," + y + ")")
					.style("stroke-width", (1.5 / k) + "px");;
					}
        })
}

//antennas
function plotants(cb) {
    if (cb.checked) {
            loadants(1,"black", "ant");
            loadants(2, "black", "ant");
            loadants(3, "black", "ant");
            loadants(4, "black", "ant");
    }
    if (!cb.checked) {
            d3.select("#ant1black").remove().transition();
            d3.select("#ant2black").remove().transition();
            d3.select("#ant3black").remove().transition();
            d3.select("#ant4black").remove().transition();
    }
}

function plotclusts(cb) {
    if(cb.checked) {
        loadants(1, "black", "clu");
        loadants(2, "red", "clu");
        loadants(3, "green", "clu");
        loadants(4, "blue", "clu");
    }
    if (!cb.checked) {
        d3.select("#clu1black").remove().transition();
        d3.select("#clu2red").remove().transition();
        d3.select("#clu3green").remove().transition();
        d3.select("#clu4blue").remove().transition();
    }
}

function randomdate(){
	var od = new Date("2011-12-31");
	var min = new Date("2011-12-05").valueOf();
	var max = new Date("2012-04-22").valueOf();
	
	var d = new Date(getRandomInt(min, max));
	var s = formdate(d);
	
	document.getElementById('date').value = s;

	function getRandomInt (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function addZ(n) {
		return (n<10)?'0'+n:''+n;
	}

	function formdate(d) {
		var d = d;
		return d.getUTCFullYear() + "-" +
			addZ(d.getUTCMonth() + 1) + "-" + 
			addZ(d.getUTCDate())
	}
	
}

function getclusts()
{
	clusts = [];
	cls = [];
	cls[0] = Number(document.getElementById("cl1").checked);
	cls[1] = Number(document.getElementById("cl2").checked);
	cls[2] = Number(document.getElementById("cl3").checked);
	cls[3] = Number(document.getElementById("cl4").checked);
	for (var i = 0; i <= 3; ++i) {
		if (cls[i] !== 0) {clusts.push(i+1)}
	}
	return clusts;
}

function randusers()
{
    var arr =[];
    document.getElementById("explain").style.color = "Blue";
    document.getElementById("explain").innerHTML = "Fetching Users...";
    var d = document.getElementById("date").value;
	var clusts = getclusts();
	if (clusts.length == 0) {
		clusts = [1,2,3,4];
	}
    d3.json("./php/rand.php?date="+d+"&clusts="+clusts, function(json)
   	{
        arr = json.rands;
		if (arr.length !== 0)
		{
        	rnums = arr.sort(function() {return 0.5 - Math.random() });
            document.getElementById("user_id").value = 
					rnums.slice(0,Math.min(arr.length,1200));
        	document.getElementById("explain").style.color = "Green";
        	document.getElementById("explain").innerHTML = "Users Fetched";
		} else {
			document.getElementById("explain").style.color = "Red";
			document.getElementById("explain").innerHTML = 
					"No users found for cluster/date choice." +
					"  Try another date, or adding a cluster.";}
    });
}

function fetch_users()
{
	var arr = [];
	var d = document.getElementById("date").value;
	var clusts = getclusts();
	if (clusts.length == 0) {
		clusts = [1,2,3,4];
	}
	console.log(d, clusts)
	d3.json("./php/rand.php?date="+d+"&clusts="+clusts, function(json)
	{
		arr = json.rands;
		console.log(arr);
		return arr;
	});
}

function clearit(){
	is_stopped = true;
	d3.select("#routes").selectAll("path").remove().transition();
	ru_day = {type: "FeatureCollection", features: []};
	ru_full = {type: "FeatureCollection", features: []};
	pu = {type: "FeatureCollection", features: []};
	p0 = {type: "FeatureCollection", features: []};	
	document.getElementById("explain").innerHTML = "Cleared!";
}

function clearall(){
	d3.select("#routes").selectAll("path").remove().transition();
}



//ZOOM
function click(d) {
      x = 0,
      y = 0,
      k = 1;
	//are we clicking somewhere new?
  if (d && centered !== d) {
	//change the center variables
    var centroid = path.centroid(d);
    x = -centroid[0]+80;
    y = -centroid[1]+80;
    k = 3; //zoom
    centered = d;
	d3.select("#explain").text("Click the blue area to zoom out.");
  } else {
    centered = null; d3.select("#explain").text(" ");
  } //grab everything we have to zoom, by class .zoomable
	aa = d3.selectAll(".zoomable").selectAll("path");
	//toggle "active" for highlighting
	aa.classed("active", centered && function(d) { return d === centered; });
	//move 'em
	aa.transition()
		.duration(1000)
		.attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")")
		.style("stroke-width", 1.5 / k + "px");
}
//second level of zoom for abidjan
//same as click()
function bigclick(d) {
      x = 0,
      y = 0,
      k = 1;
		
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = -centroid[0]+25;
    y = -centroid[1]+25;
    k = 12;
    centered = d;
	d3.select("#explain").text("Click the blue area to zoom out.");
  } else {
    centered = null; d3.select("#explain").text(" ");
  }
	aa = d3.selectAll(".zoomable").selectAll("path");

	aa.classed("active", centered && function(d) { return d === centered; });
	aa.transition()
		.duration(1000)
		.attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")")
		.style("stroke-width", 1.5 / k + "px");
}
