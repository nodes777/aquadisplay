function makeAveragesGraph(soldData){
    // create an array to fill with objects
	var avgArr = [];
								// key      value
	$.each(soldData, function(fishTypeName, object){
    	//console.log(fishTypeName +" + "+ object)
    	var avg = getAverage(object);
        var realName = getReadableName(fishTypeName);
    	avgObj = {[realName]: avg};
    	avgArr.push(avgObj);
  	});
    console.log(avgArr);
  	makeAvgGraph(avgArr);
}

function getAverage(objectArr){
	var pricesArray = objectArr.map(function(d){ return currencyToNumber(d.bPrice);});
	var total = pricesArray.reduce(function(accumulator, currentValue){
		var sum = accumulator + currentValue;
		return  sum;
	});
	var avg = total/pricesArray.length;
	return avg;
}

function makeAvgGraph(avgArr){
	var margin = {top: 20, right: 20, bottom: 100, left: 40},
        width = 1024 - margin.left - margin.right,
        height = 720 - margin.top - margin.bottom;

    // set the ranges, these are funcs that return a number, scaled to a particular domain and range
    var x = d3.scaleBand() // scaleBand determines geometry of bars, splits the range into n bands (where n is the number of values in the domain array)
              .range([0, width]) // provide a range of numbers
              .padding(0.1); // provide padding
    var y = d3.scaleLinear() // scaleLinear, input is domain, output is range (domain added below)
              .range([height, 0]);

    // Scale the range of the data in the domains
    x.domain(getOrdinals(avgArr));
    y.domain([0, getMax(avgArr)]);

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
        .data(avgArr) // data is expecting an array, of objects in this case
      .enter().append("rect") //add a rectangle for each item in the array
        .attr("class", "bar")
        // add the x position of the new rect, at the position mappped by the function x()'s domain and range, passing in the name of the fishType
        .attr("x", function(d) { return x(Object.keys(d)); })
        .attr("width", x.bandwidth())
        // add the y position of the rect, the svg canvas is inverse, so if this number is 0, then the graph looks "upside down"
        // the y function maps the passed in average number to the domain/range
        .attr("y", function(d) { return y(Object.values(d)); })
        .attr("height", function(d) {return height - y(Object.values(d)); });


    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
            //.text("")

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    //Create Title
	svg.append("text")
		.attr("x", width / 2 )
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text("Averages");

      // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Sale Price in Dollars");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.bottom)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Sale Price in Dollars");

        // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Fish");
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
   return avgArr.map(function(d) { return Object.keys(d); });
}