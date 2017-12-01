function makeLineGraph(json){
	var thirtyDayStatObj = {};

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
    		if(thirtyDayStatObj[fishTypeName] === undefined){ 
    			thirtyDayStatObj[fishTypeName] = [];
    		}

    		var avg = objectDay[fishTypeName].avg;
    		var item = fishTypeName;
    		var currentDate = date;
    		var stdDev = objectDay[fishTypeName].stdDev;
    		var salesVolume = objectDay[fishTypeName].salesVolume;

    		lineFishTypeObj = {
		        "avg": avg,
		        "item": item,
		        "stdDev": stdDev,
		        "date": currentDate,
		        "salesVolume": salesVolume
		     };

			thirtyDayStatObj[fishTypeName].push(lineFishTypeObj);
    	})
      });
	console.log(thirtyDayStatObj);
	var margin = {top: 20, right: 80, bottom: 110, left: 80},
    width = getWidthOfGraph('#lineGraph') - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;


    var svg = d3.select("#lineGraph").append("svg");
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // z is color, schemeCategory20 is a 20 color palette
    var z = d3.scaleOrdinal(d3.schemeCategory20);

    var line = d3.line()
	    .curve(d3.curveBasis)
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.avg); });

	x.domain(d3.extent(thirtyDayStatObj, function(d) { 
		console.log(d)
		console.log(d.date)
		return d.date; }));

  	y.domain([ 0, d3.max(thirtyDayStatObj, function(d) { return d.avg; })])


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
        .attr("class", "yAxisStatGraph")
        .call(yAxis);

  	svg.append('svg:path')
	  .attr('d', line(thirtyDayStatObj))
	  .attr('stroke', 'green')
	  .attr('stroke-width', 2)
	  .attr('fill', 'none');
}