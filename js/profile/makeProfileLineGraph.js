function makeProfileLineGraph(thirtyDayLineObj){

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
	    .x(function(d) {return x(d.date); })
	    .y(function(d) { return y(d.value); });

       // console.log(d3.extent(thirtyDayLineObj, function(d) { return d.date; }))

    // Supply the earliest and latest dates, choosing fw, just because they all have the same date range
	x.domain(d3.extent(thirtyDayLineObj, function(d) { return d.date; }));
    // Max point was created when first sorting the data.
  	y.domain([ 0, d3.max(thirtyDayLineObj, function(d) { return d.value; })])

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
      .text("Portfolio Value in Dollars");

    // Create Title
    svg.append("text")
        .attr("x", width / 2 )
        .attr("y", -10)
        .style("font-size", "24px")
        .style("text-anchor", "middle")
        .text("Average Portfolio Value Over Time");


    draw(thirtyDayLineObj, x, y, svg, lineFunc, height, color, tooltip)
    // add checkbox listeners
    // $("#checkBoxesDiv").on("change", "input[type=checkbox]", function(d) {
    //     var fishType = this.value;
    //     handleCheckboxChange.call(this, thirtyDayLineObj, fishType, x, y, svg, lineFunc, height, color, tooltip);
    // });


}

function handleCheckboxChange(thirtyDayLineObj, fishType, x, y, svg, lineFunc, height, color, tooltip){
    var fishType = this.value;
    var checked = this.checked;
    if(checked){draw.call(this, thirtyDayLineObj, fishType, x, y, svg, lineFunc, height, color, tooltip)}
    if(!checked){
        d3.selectAll("#line-"+fishType).remove();
        d3.selectAll("#dot-"+fishType).remove();
    }
}

function draw(data, x, y, svg, lineFunc, height, color, tooltip) {
    var formatTime = d3.timeFormat("%B %d, %Y");
    
    var t = d3.transition()
            .duration(1000)
            .ease(d3.easeLinear)

    //var fishType = data[index];

    var id = "line-";

    // Add the line path. Why does this have to be selectAll for the path to be drawn transition??
    var line = svg.selectAll("#line-")
            .data(data);

        line.enter().append("path").classed("line", true)
            .merge(line)
            .attr("d", lineFunc(data))
            .attr("id", id)
            .style("opacity", 1)
            .style("stroke", function() { // Add the colours dynamically
                return data.color = color(data); })
            .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
            .attr("stroke-dashoffset", function(d){ return this.getTotalLength() })

    var dotID = "dot-";
    var dots = svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("id", id)
        .attr("r", 3.5)
        //.style("opacity", 0)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.value); });

    dots.on("mouseover", function(d) {
            var self = this;
                dots.transition()
                    .style("stroke-width", "9px");

                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(`$${d.value} on ${formatTime(d.date)}`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                })
        .on("mouseout", function(d) {
            dots//.transition()
                .style("stroke-width", "2.5px");
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Previously using selectAll here, this wouldn't allow the otherLine selection to cause effects,
    var specificLine = svg.select("#line-");

        specificLine.transition(t)
            .attr("stroke-dashoffset", 0)

        specificLine.on("mouseover", function(d) {
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
                    .style("opacity", 0.3)
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


