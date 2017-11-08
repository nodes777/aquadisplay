function makeAveragesGraph(soldData){
    // create an array to fill with objects
	var avgArr = [];
								              // key      value
	$.each(soldData, function(fishTypeName, objectArr){
    	//console.log(fishTypeName +" + "+ objectArr)
    	var avg = getAverage(objectArr);
      var realName = getReadableName(fishTypeName);
      var stdDev = getStdDev(objectArr);
      var numOfSales = objectArr.length
    	avgObj = {"bPrice": avg,
                "item": realName,
                "stdDev": stdDev,
                "numOfSales": numOfSales
      };
    	avgArr.push(avgObj);
  	});
  makeAvgGraph(avgArr);
  //makeGraph(avgArr);
}

function makeAvgGraph(avgArr){

	var margin = {top: 20, right: 20, bottom: 110, left: 80},
        width = getWidthOfGraph() - margin.left - margin.right,
        height = 720 - margin.top - margin.bottom;

    // set the ranges, these are funcs that return a number, scaled to a particular domain and range
    var x = d3.scaleBand() // scaleBand determines geometry of bars, splits the range into n bands (where n is the number of values in the domain array)
              .range([0, width]) // provide a range of numbers
              .padding(0.1); // provide padding
    var y = d3.scaleLinear() // scaleLinear, input is domain, output is range (domain added below)
              .range([height, 0]);

    // Scale the range of the data in the domains
    x.domain(avgArr.map(function(d) { return d.item; }));
    y.domain([0, d3.max(avgArr, function(d) { return d.bPrice; })]);

    // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
    var svg = d3.select("#firstGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll(".bar")
        .data(avgArr) // data is expecting an array, of objects in this case
      .enter().append("rect") //add a rectangle for each item in the array
        .attr("class", "bar")
        // add the x position of the new rect, at the position mappped by the function x()'s domain and range, passing in the name of the fishType
        .attr("x", function(d) { return x(d.item); })
        .attr("width", x.bandwidth())
        // add the y position of the rect, the svg canvas is inverse, so if this number is 0, then the graph looks "upside down"
        // the y function maps the passed in average number to the domain/range
        .attr("y", function(d) { 
          console.log(d.bPrice)
          return y(d.bPrice); })
        .attr("height", function(d) {return height - y(d.bPrice); })
        //provide tooltip effects
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html("Average "+d.item+" Price: $"+Math.round(d.bPrice))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");


    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    //Create Title
	svg.append("text")
		.attr("x", width / 2 )
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text("Averages");

      // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Sale Price in Dollars");

  /*      // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Fish");
  */

        // Define the div for the tooltip
  var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

}


//gets the object in the array with the highest number
function getMax(avgArr){
    // Flattening this array
    var arrOfAvgsArr = avgArr.map(function(d) { return Object.values(d); });// returns array of arrays
    var maxAvgArr = arrOfAvgsArr.reduce(function(acc, curr){ return acc.concat(curr);}); // retuns array of numbers
    // es6
    //let arrayOfAvgPrices = [].concat(...arrayOfAvgPrices);
    var max = d3.max(maxAvgArr);

    return max;
}

function getOrdinals(avgArr){
  return  avgArr.map(function(d) { return Object.keys(d); });
}

function getStdDev(objectArr){
  var pricesArray = objectArr.map(function(d){ return currencyToNumber(d.bPrice);});
  var stdDev = d3.deviation(pricesArray)
  return stdDev;
}

function getAverage(objectArr){
  var pricesArray = objectArr.map(function(d){ return currencyToNumber(d.bPrice);});
  var total = pricesArray.reduce(function(accumulator, currentValue){
   var sum = accumulator + currentValue;
   return  sum;
  }); 
  var avg = total/pricesArray.length;
  return Math.round(avg);
}