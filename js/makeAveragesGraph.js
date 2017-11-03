function makeAveragesGraph(soldData){

	var avgObject = {}
								// key      value
	$.each(soldData, function(fishTypeName, object){
    	//console.log(fishTypeName +" + "+ object)
    	var avg = getAverage(object)
    	avgObject[fishTypeName] = avg;
  	});

  	makeAvgGraph(avgObject);
}

function getAverage(objectArr){
	var pricesArray = objectArr.map(function(d){ return currencyToNumber(d.bPrice)})
	var total = pricesArray.reduce(function(accumulator, currentValue){
		var sum = accumulator + currentValue;
		return  sum
	});
	var avg = total/pricesArray.length;
	return avg;
}

function makeAvgGraph(avgObject){
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1024 - margin.left - margin.right,
        height = 720 - margin.top - margin.bottom;

    // set the ranges, these are funcs that return a number, scaled to a particular domain and range
    var x = d3.scaleBand() // scaleBand determines geometry of bars, splits the range into n bands (where n is the number of values in the domain array)
              .range([0, width]) // provide a range of numbers
              .padding(0.1); // provide padding
    var y = d3.scaleLinear() // scaleLinear, input is domain, output is range (domain added below)
              .range([height, 0]);


console.log(avgObject)

    // Scale the range of the data in the domains
    x.domain(Object.keys(avgObject));
    y.domain([0, d3.max(Object.values(avgObject))]);

    // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll(".bar")
        .data(avgObject) // data is expecting an array?
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(Object.keys(avgObject)); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(Object.values(avgObject)); })
        .attr("height", function(d) { return height - y(Object.values(avgObject)); });


    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    //Create Title 
	svg.append("text")
		.attr("x", width / 2 )
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text("Averages");
}