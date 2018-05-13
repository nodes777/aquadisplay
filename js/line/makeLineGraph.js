/*jshint esversion: 6 */
function makeLineGraph(thirtyDayLineObj, maxPoint){

	var margin = {top: 40, right: 80, bottom: 110, left: 80},
    width = getWidthOfGraph('#lineGraph') - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;


    var svg = d3.select("#lineGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("role", "application") // Add accessibility info - role of application to let screen reader users know about key presses
        .attr("aria-label","Price per fish type over time") // Label for purpose of the application
        .attr("tabindex","0") // To place focus on the graph
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // schemeCategory20 is a 20 color palette
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var lineFunc = d3.line()
	    //.curve(d3.curveBasis)
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.avg); });

    // Supply the earliest and latest dates, choosing fw, just because they all have the same date range
	x.domain(d3.extent(thirtyDayLineObj.fw, function(d) { return d.date; }));
    // Max point was created when first sorting the data.
  	y.domain([ 0, maxPoint]);
    //color.domain(fishType.map(function(d) { return d.salesVolume; }));

    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

  	// add the x Axis
  	var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("aria-hidden","true") //Ensures axes will not be exposed, unnessesarily, to AT users
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "1.2em")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

 	// add the y Axis
    var yAxis = d3.axisLeft(y);
    svg.append("g")
        .attr("class", "yAxisLineGraph")
        .attr("aria-hidden","true") //Ensures axes will not be exposed, unnessesarily, to AT users
        .call(yAxis);

    // y Axis Label
    svg.append("text")
      .attr("class", "lineGraphYAxisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average Sales Price in Dollars");

    // Create Title
    svg.append("text")
        .attr("x", width / 2 )
        .attr("y", -10)
        .style("font-size", "24px")
        .style("text-anchor", "middle")
        .text("Average Fish Value Over Time");

   // $.each(thirtyDayLineObj, function(type){
     // draw(thirtyDayLineObj, type, x, y, svg, lineFunc, height, color, tooltip)
    //})

    // add checkbox listeners
    $("#checkBoxesDiv").on("change", "input[type=checkbox]", function(d) {
        var fishType = this.value;
        handleCheckboxChange.call(this, thirtyDayLineObj, fishType, x, y, svg, lineFunc, height, color, tooltip);
    });

    // Add default checked status
    // $("#fwbettasctCheckbox").trigger("click");
    $("#marketStatsCheckbox").trigger("click");
    $("#fwcatfishpCheckbox").trigger("click");

}

function handleCheckboxChange(thirtyDayLineObj, fishTypeX, x, y, svg, lineFunc, height, color, tooltip){
    var fishType = this.value;
    var checked = this.checked;
    if(checked){draw.call(this, thirtyDayLineObj, fishType, x, y, svg, lineFunc, height, color, tooltip);}
    if(!checked){
        d3.selectAll("#line-"+fishType).remove();
        d3.selectAll("#dot-"+fishType).remove();
    }
}

function draw(data, fishTypeName, x, y, svg, lineFunc, height, color, tooltip) {

    var t = d3.transition()
            .duration(1000)
            .ease(d3.easeLinear);

    var fishType = data[fishTypeName];

    // Sort by date so that months don't have a weird gap
    fishType.sort(function(a, b){return a.date - b.date;});

    var groupId = "group-"+fishTypeName;
    var lineId = "line-"+fishTypeName;
    var group = svg.append("g")
                    .attr("id", groupId)
                    .classed("lineGrouping", true)
                    .attr("tabindex", "-1");

    // Add the line path. Why does this have to be selectAll for the path to be drawn transition??
    var line = group.selectAll(lineId)
            .data(fishType);

        line.enter().append("path").classed("line", true)
            .merge(line)
            .attr("d", lineFunc(fishType))
            .attr("id", lineId)
            .style("opacity", 1)
            .style("stroke", function() { // Add the colours dynamically
                return fishType.color = color(fishTypeName); })
            .attr("stroke-dasharray", function(d){ return this.getTotalLength(); })
            .attr("stroke-dashoffset", function(d){ return this.getTotalLength(); });


    var dots = group.selectAll("dot")
        .data(fishType)
      .enter().append("circle")
        .attr("id", function(d) {return `dot-${fishTypeName}-${formatTimeDashed(d.date)}`;})
        .attr("r", 5.5)
        .attr("tabindex", "0") // Allow focus on dots
        .attr("aria-label", function(d) { return `${getReadableName(d.item)} sold ${d.avg} on ${formatTime(d.date)}`;})
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.avg); });

    dots.on("mouseover", showToolTipMouse)
        .on("mouseout", hideToolTip);
    dots.on("focus", showToolTip)
        .on("focusout", hideToolTip);
    dots.on("keypress", keyboardHandler);
    dots.on("click", keyboardHandler);


    // Previously using selectAll here, this wouldn't allow the otherLine selection to cause effects,
    var specificLine = svg.select("#line-"+fishTypeName);

        specificLine.transition(t)
            .attr("stroke-dashoffset", 0);

        specificLine.on("mouseover", lineMouseOver)
                    .on("mouseout", lineMouseOut);

    function showToolTip(d) {
        var rect = this.getBoundingClientRect();
         dots.transition()
            .style("stroke-width", "9px");
        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
        tooltip.html(`${getReadableName(d.item)} $${d.avg} on ${formatTime(d.date)}`)
            .style("left",  `${rect.left}px`)
            .style("top",  `${rect.top + height}px`);
    }
    function showToolTipMouse(d) {
        dots.transition()
            .style("stroke-width", "9px");
        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
        tooltip.html(`${getReadableName(d.item)} $${d.avg} on ${formatTime(d.date)}`)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    }

    function hideToolTip(d) {
        dots//.transition()
            .style("stroke-width", "2.5px");
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

    function lineMouseOver(d) {
        var self = this;
        specificLine.transition()
            .style("stroke-width", "9px");

        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
        tooltip.html(getReadableName(d.item))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        var otherLines = d3.selectAll("path.line").filter(function (x) { return self != this; })
            .style("opacity", 0.3);
    }

    function lineMouseOut (d) {
        specificLine//.transition()
            .style("stroke-width", "2.5px");
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        d3.selectAll("path").transition()
            .style("opacity", 1);
    }
}


function keyboardHandler (d,i,nodes) {  // left, up, right, down
    // console.log(`d: ${JSON.stringify(d)}`);
    // console.log(`i: ${i}`); // 0
    // console.log(`nodes: ${nodes}`); // svg obj
    // console.log(`parent: ${JSON.stringify(d3.select(this.parentNode))}`); // svg obj
    //console.log(`Date plus: ${formatTimeDashed(new Date(d.date.getTime()+(1*24*60*60*1000)))}`);
    //console.log(`d3.event: ${d3.event}`);
    var fishTypeFromGroupId;
    if (d3.event.keyCode == 37 || d3.event.keyCode == 38 || d3.event.keyCode == 39 || d3.event.keyCode == 40 ) {
        d3.event.preventDefault();
        //left
        if (d3.event.keyCode == 37 ) {this.previousSibling.focus();}
        //right, add one day to the date obj
        if (d3.event.keyCode == 39 ) {this.nextSibling.focus();}
        //var nextGroup = document.getElementById(`group-${fishType}`);
        // up
        if (d3.event.keyCode == 38 ) {
            console.log(this.parentNode.previousSibling);// go to this fish's parent group, then look for the next fish group
            fishTypeFromGroupId = this.parentNode.previousSibling.id.slice(6); // grab the fishtype from the id
            document.getElementById(`dot-${fishTypeFromGroupId}-${formatTimeDashed(d.date)}`).focus(); // focus with the dot-fishtype-date id pattern
        }
        // down
        if (d3.event.keyCode == 40 ) {
            console.log(this.parentNode.nextSibling);
            fishTypeFromGroupId = this.parentNode.nextSibling.id.slice(6);
            document.getElementById(`dot-${fishTypeFromGroupId}-${formatTimeDashed(d.date)}`).focus();
        }
       // document.getElementById(`dot-${d.item}-${formatTimeDashed(d.date)}`).focus();
    }
}
