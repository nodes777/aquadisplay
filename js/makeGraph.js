function makeGraph(fishType, fishTypeName){
	//fishType is a object of objects

   // set the dimensions and margins of the graph
    var margin = {top: 30, right: 20, bottom: 60, left: 80},
        width = getWidthOfGraph('#secondGraph') - margin.left - margin.right -20,
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

    // Create Bars
    svg.selectAll(".bar")
        .data(fishType)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.item); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(currencyToNumber(d.bPrice)); })
        .attr("height", function(d) { return height - y(currencyToNumber(d.bPrice)); })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip .html(d.item+" $"+currencyToNumber(d.bPrice))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


    // Add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
      .selectAll(".tick text")
        // wrap the text so that the words don't overlap
        .call(wrap, x.bandwidth());

    // Add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Create Title
	svg.append("text")
		.attr("x", width / 2 )
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text("Sold " + getReadableName(fishTypeName));

    // Create Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.bottom)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Sale Price in Dollars");

    // Create X axis label
    svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Fish");

      // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

}


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}