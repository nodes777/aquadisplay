var statArr = [];

function makeStatsGraph(soldData){
    // create an array to fill with objects
								              // key      value
	$.each(soldData, function(fishTypeName, objectArr){
    	//console.log(fishTypeName +" + "+ objectArr)
    	var avg = getAverage(objectArr);
      var realName = getReadableName(fishTypeName);
      var stdDev = getStdDev(objectArr);
      var salesVolume = objectArr.length;
    	avgObj = {
        "avg": avg,
        "item": realName,
        "fishTypeName": fishTypeName,
        "stdDev": stdDev,
        "salesVolume": salesVolume
      };
    	statArr.push(avgObj);
  	});
  initAvgGraph(statArr);
  setTodaysPrices(statArr);

}

function initAvgGraph(statArr){

	var margin = {top: 20, right: 80, bottom: 140, left: 80},
        width = getWidthOfGraph('#dailyStatsGraph') - margin.left - margin.right,
        height = 720 - margin.top - margin.bottom;

    // set the ranges, these are funcs that return a number, scaled to a particular domain and range
    var x = d3.scaleBand() // scaleBand determines geometry of bars, splits the range into n bands (where n is the number of values in the domain array)
              .range([0, width]) // provide a range of numbers
              .padding(0.1); // provide padding
    var y = d3.scaleLinear() // scaleLinear, input is domain, output is range (domain added below)
              .range([height, 0]);

    // Scale the range of the data in the domains
    x.domain(statArr.map(function(d) { return d.item; }));
    y.domain([0, d3.max(statArr, function(d) { return d.avg; })]);

    // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
    var svg = d3.select("#dailyStatsGraph").append("svg")
        //.attr("role","application")// role of application for screen readers
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var bars = svg.selectAll(".bar")
        .data(statArr) // data is expecting an array, of objects in this case
      .enter().append("rect")//add a rectangle for each item in the array
        .attr("class", "bar statGraphBar")
        // add the x position of the new rect, at the position mappped by the function x()'s domain and range, passing in the name of the fishType
        .attr("x", function(d) { return x(d.item); })
        .attr("width", x.bandwidth())
        // set y and height to 0, they will grow in the transition
        .attr("y", y(0))
        .attr("height", 0)
        .attr("aria-label", function(d) { return `Average ${d.item} Price: $ ${Math.round(d.avg)}`});// Provide labels for screen readers

      // Transition for growing the bars upwards
      var rect = d3.selectAll("rect");
        // add the y position of the rect, the svg canvas is inverse, so if this number is 0, then the graph looks "upside down"
        // the y function maps the passed in average number to the domain/range
      rect.transition().duration(1500)//ease(d3.easeElastic)
        .attr("y", function(d) { return y(d.avg); })
        .attr("height", function(d) {return height - y(d.avg); });

        //provide tooltip effects
      bars.on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`Average ${d.item} Price: $ ${Math.round(d.avg)}`)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


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
            .attr("aria-hidden","true") // hide the axis from assistive technology
            .attr("transform", "rotate(-65)");


    // add the y Axis
    var yAxis = d3.axisLeft(y);
    svg.append("g")
        .attr("class", "yAxisStatGraph") 
        .attr("aria-hidden","true") // hide the axis from assistive technology
        .call(yAxis);

    //Create Title
	  svg.append("text")
		.attr("x", width / 2 )
        .attr("id", "statGraphTitle")
        .attr("y", -5)
        .style("text-anchor", "middle")
        .text("Average Price of Fish Type");

      // text label for the y axis
    svg.append("text")
      .attr("class", "statGraphYAxisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Sale Price in Dollars");


        // Define the div for the tooltip
  var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

  var radioButtons = document.getElementsByName('graphType');
  for (let radio of radioButtons) {
    radio.addEventListener("change", function(d) {
        graphType = this.value;
        changeStat.call(this, d, statArr, graphType, x, y, yAxis, xAxis, svg, height, tooltip);
    });
  }


}
