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

    var margin = {top: 20, right: 30, bottom: 30, left: 40};
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var y = d3.scaleLinear()
        .range([height, 0])
        //set the y domain from 0 to max number
        .domain([0, d3.max(fw, function(d){
            var num = currencyToNumber(d.bPrice);
            return num;
        })]);

    // Previously Scale Ordinal
    var x = d3.scaleBand()
            // return a new array of jsut the names
            .domain(fw.map(function(fw){ return fw.item}))
            // starting pixel positions, with optional parameter for padding between bars
            .rangeRound([0, width])
            .padding(0.1);

    // bind our xAxis scale to the x func, can be stamped in multiple places
    var xAxis = d3.scale.axis()
                .scale(x)
                .orient("bottom");

    

    var chart = d3.select("#currentDayData")
                //the w and height are applied
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                // Add a g element to offset the origin of the chart area by the top-left margin
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


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


    */