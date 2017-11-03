function makeGraph(data, fishTypeName){
    var fishType = data;
    console.log(fishType);

   // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1024 - margin.left - margin.right,
        height = 720 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);

    // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

         // Scale the range of the data in the domains
    x.domain(fishType.map(function(d) { return d.item; }));
    y.domain([0, d3.max(fishType, function(d) { return currencyToNumber(d.bPrice); })]);

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
        .call(d3.axisBottom(x));

          // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    //Create Title 
	svg.append("text")
		.attr("x", width / 2 )
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text(fishTypeName+" sold fish");

}