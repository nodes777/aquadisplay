function changeStat(d, statArr, graphType, x, y, yAxis, xAxis, svg, height, tooltip){

          x.domain(statArr.map(function(d) { return d.item; }));
          y.domain([0, d3.max(statArr, function(d) {return currencyToNumber(d[graphType]); })]);

          yAxis.scale(y);
          xAxis.scale(x);

          var tooltipVerb = getTooltipVerb(graphType);

          //d3.selectAll(".statGraphBar").style("opacity", 1).transition().duration(300).style("opacity", 0).remove();// whyyyyyyyyy doesnt this actually remove the elements????
          d3.selectAll(".statGraphBar").remove();// needed to remove the elements from the DOM

        /* This fades out correctly, but when new bars appear, some bars are just missing
         d3.selectAll(".categoryBar")
            .style("opacity", 1)
          .transition()
          .duration(300)
            .style("opacity", 0).remove();
        */

          var barsOfCategory = svg.selectAll(".statGraphBar")
            .data(statArr)
          .enter().append("rect") //update?
            .attr("class", "bar statGraphBar")
            .style("opacity", 1)
            .attr("x", function(d) { return x(d.item); })
            .attr("width", x.bandwidth())
            .attr("y", y(0))
            .attr("height", 0);

          barsOfCategory.transition().duration(1500)
            .attr("y", function(d) { return y(Math.round(currencyToNumber(d[graphType]))); })
            .attr("height", function(d) { return height - y(currencyToNumber(d[graphType])); });

          barsOfCategory.on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(d.item+" "+tooltipVerb+Math.round(currencyToNumber(d[graphType])))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

            //Transition y Axis
            svg.select(".yAxisStatGraph")
                    .transition().duration(2500).ease(d3.easeExp)
                    .call(yAxis);

            //Change title
            svg.select("#statGraphTitle")
                .text(getTooltipVerb(graphType));
}