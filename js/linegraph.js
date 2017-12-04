function makeLineGraph(json){
	var thirtyDayLineObj = {};
    var maxPoint = 0;
    var parseTime = d3.timeParse("%b-%Y-%d-%a");

	/* Format data, each line/category must be an entry in the array */
	$.each(json, function(date, objectDay){
		/* Within a particular day*/
    	//console.log(date +" + "+ JSON.stringify(objectDay))
    	var fishTypeNames = Object.keys(objectDay); // array of just the names
    	var date = date;
    	console.log(date)

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

			thirtyDayLineObj[fishTypeName].push(lineFishTypeObj);
    	})
      });


	console.log(thirtyDayLineObj);
	var margin = {top: 20, right: 80, bottom: 110, left: 80},
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

    var line = d3.line()
	    .curve(d3.curveBasis)
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.avg); });

    // Supply the earliest and latest dates
    //console.log(d3.extent(thirtyDayLineObj.fw, function(d) { return d.date; }))
	x.domain(d3.extent(thirtyDayLineObj.fw, function(d) { return d.date; }));
    // Max point was created when first sorting the data.
  	y.domain([ 0, maxPoint])
    //color.domain(fishType.map(function(d) { return d.salesVolume; }));


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


    $.each(thirtyDayLineObj, function(type){
      draw(thirtyDayLineObj, type, x, y, svg, line, height, color)
    })

}


function draw(data, fishTypeName, x, y, svg, line, height, color) {
  
  var fishType = data[fishTypeName];
  console.log(fishType)

  // Add the line path.
  svg.append("path")
      .data(fishType)
      .attr("class", "line")
      .style("stroke", function() { // Add the colours dynamically
                return fishType.color = color(fishTypeName); })
      .attr("d", line(fishType));  

}
