function create_LS(u_id, coords, col) {
    var f = {type: "Feature",
             geometry: {type: "LineString",
                        "coordinates": coords},
             properties: {"name": u_id,
                          "prop0": col}
            };
    return f;
}

function update(data, count, m)
{
	if (count !== 0 && m !== 0) {
		var done = String(Math.floor(100*(count/m)));
		document.getElementById("explain").style.color="CornflowerBlue";
		document.getElementById("explain").innerHTML = "Plotting... " +
			done + "% done.";
	}
	routes = d3.select("#routes").selectAll("path").data(data.features);
	path = path.pointRadius(5);
	//are we zoomed?
//	console.log(data)
	if (x == 0){
		routes.enter().append("path")
		.attr("d", path)
		.attr("fill-opacity", 0)
		.style("stroke-width", 1)
		.style("stroke", function(d,i){return data.features[i].properties.prop0})
		.attr("id", function(d,i){return data.features[i].properties.name})
		.on("mouseover", myMouseOverFunction)
		.on("mouseout", myMouseOutFunction)
		} else {
		//zoomed! better transform everything here
		routes.enter().append("path")
		.attr("d", path)
		.attr("fill-opacity", 0)
		.style("stroke-width", 1)
		.attr("id", function(d,i){return data.features[i].properties.name})
		.style("stroke", function(d,i){return data.features[i].properties.prop0})
		.attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")")
		.style("stroke-width", (1.5 / k) + "px")
		.on("mouseover", myMouseOverFunction)
		.on("mouseout", myMouseOutFunction);
		}
}
