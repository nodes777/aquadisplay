function changeCategory(d, selection, fishType, x, y, yAxis, xAxis, svg, height, width, tooltip, selectionName){
    checkIfSales(selection, svg, height, width);

          x.domain(selection.map(function(d) { return d.item; }));
          y.domain([0, d3.max(selection, function(d) { return currencyToNumber(d.bPrice); })]);

          yAxis.scale(y);
          xAxis.scale(x);

          //d3.selectAll(".categoryBar").style("opacity", 1).transition().duration(300).style("opacity", 0).remove();// whyyyyyyyyy doesnt this actually remove the elements????
          d3.selectAll(".categoryBar").remove();// needed to remove the elements from the DOM

        /* This fades out correctly, but when new bars appear, some bars are just missing
         d3.selectAll(".categoryBar")
            .style("opacity", 1)
          .transition()
          .duration(300)
            .style("opacity", 0).remove();
        */

          var barsOfCategory = svg.selectAll(".categoryBar")
            .data(selection)
          .enter().append("rect") //update?
            .attr("class", "bar categoryBar")
            .style("opacity", 1)
            .attr("x", function(d) { return x(d.item); })
            .attr("width", x.bandwidth())
            .attr("y", y(0))
            .attr("height", 0);

          barsOfCategory.transition().duration(1500)
            .attr("y", function(d) { return y(Math.round(currencyToNumber(d.bPrice))); })
            .attr("height", function(d) { return height - y(currencyToNumber(d.bPrice)); });

          barsOfCategory.on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(d.item+" $"+currencyToNumber(d.bPrice))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

          // Change Title
            svg.select("#categoryBarTitle")
              .text("Sold " + getReadableName(selectionName));

            //Transition y Axis
            svg.select(".yAxis")
                    .transition().duration(2500).ease(d3.easeExp)
                    .call(yAxis);

            //Transition x Axis
            svg.select(".xAxis")
                    .call(xAxis);

            svg.select(".xAxis").selectAll(".tick text")
                .call(wrap, x.bandwidth());

         }

function checkIfSales(selection, svg, height, width){
      if(selection.length === 0){
        svg.append("text")
          .attr("y", (height / 2))
          .attr("x", (width/2) )
          .attr("id","noSales")
          .attr("class", "text-center")
          .style("text-anchor", "middle")
          .text("No sales of that fish type today");
      } else {
        svg.select("#noSales")
          .remove()
      }
}