var monthAndYear = getCurrentMonth();
var today = getCurrentDay();
console.log(monthAndYear);
console.log(today);


$.ajax({
  url: "https://aquascraper-data.firebaseio.com/"+monthAndYear+"/"+today+".json?callback=processJson&print=pretty",
  dataType: "jsonp",
  jsonpCallback: "processJson"
});

function processJson(json){
  console.log(json);
  // get the sold and unsold as one object. Skipping the messy name Firebase creates
  var jsonPruned = json[Object.keys(json)[0]];
  console.log(jsonPruned);

  makeGraphs(jsonPruned);
}

function makeGraphs(data){
    var fw = data.sold.fw;
    console.log(fw);

    // width and height of chart area

   // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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
          x.domain(fw.map(function(fw) { return fw.item; }));
          y.domain([0, d3.max(fw, function(d) { return currencyToNumber(d.bPrice); })]);

            svg.selectAll(".bar")
              .data(fw)
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

}

    //$('#currentDayData').html(JSON.stringify(data,null,4));

    /*

// there are no divs inside of currentDayData, hang on we will make some
    .selectAll("div")
    //pass in data, executes for each item (in array?)
    .data(data.sold.fw)
        // Creates placeholder?
        .enter()
        .append("div")
        .style("width", function(d) {
            var currency = d.bPrice;
            // bPrice comes as a string with dollar sign, remove with regex
            var width = Number(currency.replace(/[^0-9\.-]+/g,""));
            return width + "px";
        })
        .text(function(d) { return d.item; });

var barWidth = (width/fw.length);

    var bar = chart.selectAll("g")
            .data(fw)
            .enter()
            .append("g")
            // move each bar to i*barWidth
            .attr("transform", function(d, i){
                return "translate(" + i * barWidth + ",0)";
            });

    bar.append("rect")
        .attr("y", function(d){
            var num = currencyToNumber(d.bPrice);
            return y(num);})
        .attr("height", function(d){
            return height - y(currencyToNumber(d.bPrice));
        })
        .attr("width", barWidth);

    bar.append("text")
        .attr("x", barWidth/2)
        .attr("y", function(d){ return y(currencyToNumber(d.bPrice));})
        .attr("dy", ".75em")
        .text(function(d){ return d.bPrice;});
    */