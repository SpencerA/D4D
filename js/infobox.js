var myMouseOverFunction = function() {
    var line = d3.select(this);
    line.attr("stroke", "red" );
    var infobox = d3.select(".infobox");
    infobox.style("display", "block");
	infobox.style("position", "absolute");
	infobox.style("right", "50px");
	infobox.style("top", "50px");
    infobox.selectAll("p").text("This path is for userID: "+ line.attr("id"));
}

var myMouseOutFunction = function() {
    var line = d3.select(this);
    line.attr("stroke", "steelblue" );
}

var myMouseMoveFunction = function() {
    var infobox = d3.select(".infobox");
    var coord = d3.svg.mouse(this)
    infobox.style("left", coord[0] + 400  + "px");
    infobox.style("top", coord[1] + "px");
}
