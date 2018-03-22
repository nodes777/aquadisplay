function makeLineGraph(json){
	var thirtyDayLineObj = {};
    var maxPoint = 0;
    var parseTime = d3.timeParse("%b-%Y-%d-%a");
    var formatDate = d3.timeFormat("%B %d")
/*
    var marketStats = {
        "avg": avg,
        "item": item,
        "stdDev": stdDev,
        "date": currentDate,
        "salesVolume": salesVolume
    }
*/
	/* Format data, each line/category must be an entry in the array */
	$.each(json, function(date, objectDay){
		/* Within a particular day*/
    	//console.log(date +" + "+ JSON.stringify(objectDay))
    	var fishTypeNames = Object.keys(objectDay); // array of just the names
    	var date = date;
    	//console.log(date)

    	$.each(fishTypeNames, function(index, fishTypeName){
    		/* Within a particular fish type*/
    		// Just leave if its the timestamp
    		if(fishTypeName === "timestamp"){ return;}
    		// Create the empty array if there isn't an array there yet
    		if(thirtyDayLineObj[fishTypeName] === undefined){
    			thirtyDayLineObj[fishTypeName] = [];
    		}

    		var avg = objectDay[fishTypeName].avg;
            // Check the max point for y domain
            if(avg > maxPoint){ maxPoint = avg;}
    		var item = fishTypeName;
    		var currentDate = parseTime(date);
    		var stdDev = objectDay[fishTypeName].stdDev;
    		var salesVolume = objectDay[fishTypeName].salesVolume;

    		lineFishTypeObj = {
		        "avg": avg,
		        "item": item,
		        "stdDev": stdDev,
		        "date": currentDate,
		        "salesVolume": salesVolume
		     };
            // Add that days stats to the array for the fishtype within the 30day obj
			thirtyDayLineObj[fishTypeName].push(lineFishTypeObj);
    	})
      });
    thirtyDayLineObj.marketStats = createMarketStats(thirtyDayLineObj)

    /*
    *-------------------------------------------------------------------------------------------------
    * Create Graph
    *-------------------------------------------------------------------------------------------------
    */
	var margin = {top: 40, right: 80, bottom: 110, left: 80},
    width = getWidthOfGraph('#lineGraph') - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;


    var svg = d3.select("#lineGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
  	y.domain([ 0, maxPoint])
    //color.domain(fishType.map(function(d) { return d.salesVolume; }));

            // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
  	// add the x Axis
  	var xAxis = d3.axisBottom(x);
    svg.append("g")
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
    $("#fwMixedCheckbox").trigger("click")
    $("#fwCheckbox").trigger("click")
    $("#fwcatfishpCheckbox").trigger("click")

}

function handleCheckboxChange(thirtyDayLineObj, fishType, x, y, svg, lineFunc, height, color, tooltip){
    var fishType = this.value;
    var checked = this.checked;
    if(checked){draw.call(this, thirtyDayLineObj, fishType, x, y, svg, lineFunc, height, color, tooltip)}
    if(!checked){d3.selectAll("#line-"+fishType).remove();}
}

function draw(data, fishTypeName, x, y, svg, lineFunc, height, color, tooltip) {

    var t = d3.transition()
            .duration(1000)
            .ease(d3.easeLinear)

    var fishType = data[fishTypeName];
    //console.log(fishType)
    var id = "line-"+fishTypeName;

    // Add the line path. Why does this have to be selectAll for the path to be drawn transition??
    var line = svg.selectAll("#line-"+fishTypeName)
            .data(fishType);

        line.enter().append("path").classed("line", true)
            .merge(line)
            .attr("d", lineFunc(fishType))
            .attr("id", id)
            .style("opacity", 1)
            .style("stroke", function() { // Add the colours dynamically
                return fishType.color = color(fishTypeName); })
            .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
            .attr("stroke-dashoffset", function(d){ return this.getTotalLength() })

    var specificLine = svg.selectAll("#line-"+fishTypeName);

        specificLine.transition(t)
            .attr("stroke-dashoffset", 0)


        specificLine.on("mouseover", function(d) {
            var self = this;
                specificLine.transition()
                    .style("stroke-width", "9px");

                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(getReadableName(d.item)+" $"+d.avg)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

                // for all the other lines, reduce opacity
                //var otherLines = d3.selectAll(".line").nodes()//.filter(function (x) { return self != this; }).style("opacity", 0.3);
                //otherLines.style = "0.3";
                var otherLines = d3.selectAll("path.line").filter(function (x) { return self != this; })
                otherLines.style("opacity", 0.3)
                //var mixed = d3.select("#line-fwmixed").style("opacity", 0.3)
                //console.log(otherLines)
                //console.log(this)
                //console.log(mixed)

                })
        .on("mouseout", function(d) {
            specificLine//.transition()
                .style("stroke-width", "2.5px");
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.selectAll("path").transition()
                .style("opacity", 1)
        });

}