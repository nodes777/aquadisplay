function makeLineGraph(json){
	var thirtyDayStatObj = {};

	// Format data, each line/category must be an entry in the array
	$.each(json, function(date, objectDay){
		/* Within a particular day*/
    	//console.log(date +" + "+ JSON.stringify(objectDay))
    	var fishTypeNames = Object.keys(objectDay); // array of just the names
    	var date = date;
    	console.log(date)

    	 debugger
    	$.each(fishTypeNames, function(index, fishTypeName){
    		/* Within a particular fish type*/
    		// Just leave if its the timestamp 
    		if(fishTypeName === "timestamp"){ return;}

    		thirtyDayStatObj[fishTypeName] = [];

    		console.log(fishTypeName)
			console.log(index)
    		console.log(date)      		/* CANT ACCESS DATE, NEED PARTIAL FUNC?*/

    		var avg = objectDay[fishTypeName].avg;
    		var item = fishTypeName;
    		var stdDev = objectDay[fishTypeName].stdDev;
    		var date = date;
    		var salesVolume = objectDay[fishTypeName].salesVolume;

    		lineFishTypeObj = {
		        "avg": avg,
		        "item": item,
		        "stdDev": stdDev,
		        "date": date,
		        "salesVolume": salesVolume
		     };
		    console.log(lineFishTypeObj)
			thirtyDayStatObj[fishTypeName].push(lineFishTypeObj);
    	})
      });

	var margin = {top: 20, right: 80, bottom: 110, left: 80},
    width = getWidthOfGraph('#lineGraph') - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;


    var svg = d3.select("lineGraph").append("svg");
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    // z is color, schemeCategory20 is a 20 color palette
    z = d3.scaleOrdinal(d3.schemeCategory20);

    var line = d3.line()
	    .curve(d3.curveBasis)
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.avg); });



	x.domain(d3.extent(thirtyDayStatArr, function(d) { return d.date; }));

  	y.domain([ 0, d3.max(thirtyDayStatArr, function(d) { return d.avg; })])
}