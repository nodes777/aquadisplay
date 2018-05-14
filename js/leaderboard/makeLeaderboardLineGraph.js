/*jshint esversion: 6 */
function makeLeaderboardLineGraph(topTenArr){

	var margin = {top: 40, right: 80, bottom: 110, left: 80},
    width = getWidthOfGraph('#leaderboardGraph') - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;


    var svg = d3.select("#leaderboardGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("role", "application") // Add accessibility info - role of application to let screen reader users know about key presses
        .attr("aria-label","Leaderboard Line Graph") // Label for purpose of the application
        .attr("tabindex","0")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // schemeCategory20 is a 20 color palette
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var lineFunc = d3.line()
	    //.curve(d3.curveBasis)
	    .x(function(d) {return x(new Date(d.timestamp)); })
	    .y(function(d) {return y(d.value); });

    var parseTime = d3.timeParse("%b-%Y-%e-%a"); // Not used, but useful

    // Trying to get the timestamp of every players all stats...
    var timestampArr = [];
    var valuesArr = [];
    for(let i = 0; i<topTenArr.length; i++){
        for(let obj in topTenArr[i].history){
            timestampArr.push(topTenArr[i].history[obj].timestamp);
            valuesArr.push(topTenArr[i].history[obj].value);
        }
    }


	x.domain(d3.extent(timestampArr, function(d) { return new Date (d); }));
    // Max point was created when first sorting the data.
  	y.domain([ 0, d3.max(valuesArr, function(d) { return d; })]);

    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity", 0);

  	// add the x Axis
  	var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("aria-hidden","true") //Ensures axes will not be exposed, unnessesarily, to AT users
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
        .attr("aria-hidden","true") //Ensures axes will not be exposed, unnessesarily, to AT users
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
        .text("Top Ten Player's Portfolio Value Over Time");

   $.each(topTenArr, function(index, player){
        draw(player, index, x, y, svg, lineFunc, height, color, tooltip);
    });

}

function draw(data, index, x, y, svg, lineFunc, height, color, tooltip) {
    var formatTime = d3.timeFormat("%B %d, %Y");
    // format the data into an array
    var dataArr = Object.values(data.history);

    var t = d3.transition()
            .duration(1000)
            .ease(d3.easeLinear);

    var id = "line-"+index;

    var line = svg.selectAll("#line-"+index)
            .data(dataArr);

        line.enter().append("path").classed("line", true)
            .merge(line)
            .attr("d", lineFunc(dataArr))
            .attr("id", id)
            .style("opacity", 1)
            .style("stroke", function() { // Add the colours dynamically
                return dataArr.color = color(index); })
            .attr("stroke-dasharray", function(d){ return this.getTotalLength(); })
            .attr("stroke-dashoffset", function(d){ return this.getTotalLength(); })

    var dotID = "dot-"+index;
    var dots = svg.selectAll("dot")
        .data(dataArr)
      .enter().append("circle")
        .attr("id", function(d) {return `dot-${data.username}-${formatTimeDashed(d.timestamp)}`;})
        .attr("tabindex","0")
        .attr("r", 5.5)
        .attr("aria-label", function(d) { return `${(data.username)}'s portfolio valued at ${d.value} on ${formatTime(d.timestamp)}`;})
        .attr("cx", function(d) { return x(d.timestamp); })
        .attr("cy", function(d) { return y(d.value); });


    dots.on("mouseover", function(d, i, dots) {
            d3.select(this).transition()
                .style("stroke-width", "9px");

            d3.select("#tooltip").transition()
                .duration(200)
                .style("opacity", 0.9);
             d3.select("#tooltip").html(`${data.username}  $${d.value} on ${formatTime(d.timestamp)}`)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
                d3.select(this)//.transition()
                    .style("stroke-width", "2.5px");
                d3.select("#tooltip").transition()
                    .duration(500)
                    .style("opacity", 0);
            })
        .on("focus", function(d) {
                var rect = this.getBoundingClientRect();
                d3.select(this).transition()
                    .style("stroke-width", "9px");
                d3.select("#tooltip").transition()
                    .duration(200)
                    .style("opacity", 0.9);
                d3.select("#tooltip").html(`${data.username}  $${d.value} on ${formatTime(d.timestamp)}`)
                    .style("left",  `${rect.left}px`)
                    // This should be dependent on the size of the leaderboard!!!!!!!!!!!!
                    .style("top",  `${800}px`);
                    //.style("top",  `${rect.top + d3.select("svg").node().getBoundingClientRect().top}px`);
            })
        .on("focusout", function(d) {
                d3.select(this)//.transition()
                    .style("stroke-width", "2.5px");
                d3.select("#tooltip").transition()
                    .duration(500)
                    .style("opacity", 0);
            })
        .on("keypress", keyboardHandler);


    // Previously using selectAll here, this wouldn't allow the otherLine selection to cause effects,
    var specificLine = svg.select("#line-"+index);

        specificLine.transition(t)
            .attr("stroke-dashoffset", 0);

        specificLine.on("mouseover", function(d) {
            // get username from data JSON, this isn't in the d parameter
            let name = data.username;
            var self = this;
                specificLine.transition()
                    .style("stroke-width", "9px");

                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                var otherLines = d3.selectAll("path.line").filter(function (x) { return self != this; })
                    .style("opacity", 0.3);
                })
        .on("mouseout", function(d) {
            specificLine//.transition()
                .style("stroke-width", "2.5px");
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.selectAll("path").transition()
                .style("opacity", 1);
        });

}


// function showToolTipMouse(d, i, dots) {
//     d3.select(this).transition()
//         .style("stroke-width", "9px");

//     d3.select("#tooltip").transition()
//         .duration(200)
//         .style("opacity", 0.9);
//      d3.select("#tooltip").html(`${data.username}  $${d.value} on ${formatTime(d.timestamp)}`)
//         .style("left", (d3.event.pageX) + "px")
//         .style("top", (d3.event.pageY - 28) + "px");
// }

// function showToolTip(d) {
//     var rect = this.getBoundingClientRect();
//     d3.select(this).transition()
//         .style("stroke-width", "9px");
//     d3.select("#tooltip").transition()
//         .duration(200)
//         .style("opacity", 0.9);
//     d3.select("#tooltip").html(`${getReadableName(d.item)} $${d.avg} on ${formatTime(d.date)}`)
//         .style("left",  `${rect.left}px`)
//         .style("top",  `${rect.top + d3.select("svg").node().getBoundingClientRect().height-200}px`);
// }

// function hideToolTip(d) {
//     d3.select(this)//.transition()
//         .style("stroke-width", "2.5px");
//     d3.select("#tooltip").transition()
//         .duration(500)
//         .style("opacity", 0);
// }

// function lineMouseOver(d) {
//     var self = this;
//     d3.select(this).transition()
//         .style("stroke-width", "9px");

//     d3.select("#tooltip").transition()
//         .duration(200)
//         .style("opacity", 0.9);
//     d3.select("#tooltip").html(getReadableName(d.item))
//         .style("left", (d3.event.pageX) + "px")
//         .style("top", (d3.event.pageY - 28) + "px");
//     var otherLines = d3.selectAll("path.line").filter(function (x) { return self != this; })
//         .style("opacity", 0.3);
// }

// function lineMouseOut (d) {
//     d3.select(this)//.transition()
//         .style("stroke-width", "2.5px");
//     d3.select("#tooltip").transition()
//         .duration(500)
//         .style("opacity", 0);
//     d3.selectAll("path").transition()
//         .style("opacity", 1);
// }

function keyboardHandler (d,i,nodes) {  // left, up, right, down
    // console.log(`d: ${JSON.stringify(d)}`);
    // console.log(`i: ${i}`); // 0
    // console.log(`nodes: ${nodes}`); // svg obj
    // console.log(`parent: ${JSON.stringify(d3.select(this.parentNode))}`); // svg obj
    // console.log(`Date plus: ${formatTimeDashed(new Date(d.date.getTime()+(1*24*60*60*1000)))}`);
    // console.log(`d3.event: ${d3.event}`);
    var fishTypeFromGroupId;
    if (d3.event.keyCode == 37 || d3.event.keyCode == 38 || d3.event.keyCode == 39 || d3.event.keyCode == 40 ) {
        d3.event.preventDefault();
        //left
        if (d3.event.keyCode == 37 ) {this.previousSibling.focus();}
        //right
        if (d3.event.keyCode == 39 ) {this.nextSibling.focus();}
        // up
        if (d3.event.keyCode == 38 ) {
            // go to this fish's parent group, then look for the next fish group
            fishTypeFromGroupId = this.parentNode.previousSibling.id.slice(6); // grab the fishtype from the id
            document.getElementById(`dot-${fishTypeFromGroupId}-${formatTimeDashed(d.date)}`).focus(); // focus with the dot-fishtype-date id pattern
        }
        // down
        if (d3.event.keyCode == 40 ) {
            fishTypeFromGroupId = this.parentNode.nextSibling.id.slice(6);
            document.getElementById(`dot-${fishTypeFromGroupId}-${formatTimeDashed(d.date)}`).focus();
        }
    }
}