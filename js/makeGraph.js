function makeGraph(data, fishTypeName){
	//fishType is a object of objects
    var fishType = data;

   // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1024 - margin.left - margin.right,
        height = 720 - margin.top - margin.bottom;

    // set the ranges, these are funcs that return a number, scaled to a particular domain and range
    var x = d3.scaleBand() // scaleBand determines geometry of bars, splits the range into n bands (where n is the number of values in the domain array)
              .range([0, width]) // provide a range of numbers
              .padding(0.1); // provide padding
    var y = d3.scaleLinear() // scaleLinear, input is domain, output is range (domain added below)
              .range([height, 0]);


    // Scale the range of the data in the domains
    x.domain(fishType.map(function(d) { return d.item; }));
    y.domain([0, d3.max(fishType, function(d) { return currencyToNumber(d.bPrice); })]);

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
        .data(fishType)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.item); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(currencyToNumber(d.bPrice)); })
        .attr("height", function(d) { return height - y(currencyToNumber(d.bPrice)); });


    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "xAxisLabel")
        .call(d3.axisBottom(x));

    svg.selectAll('xAxisLabel').each(insertLineBreaks);


    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    //Create Title
	svg.append("text")
		.attr("x", width / 2 )
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text("Sold "+getReadableName(fishTypeName));

}

function insertLineBreaks(d) {
    var el = d3.select(this);
    var words = d.split(' ');
    el.text('');

    for (var i = 0; i < words.length; i++) {
        var tspan = el.append('tspan').text(words[i]);
        if (i > 0)
            tspan.attr('x', 0).attr('dy', '15');
    }
}