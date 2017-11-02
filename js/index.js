var monthAndYear = getCurrentMonth();
var today = getCurrentDay();
console.log(monthAndYear);
console.log(today);


$.ajax({
  url: "https://aquascraper-data.firebaseio.com/"+monthAndYear+"/"+today+".json?callback=logResults&print=pretty",
  dataType: "jsonp",
  jsonpCallback: "logResults"
});

function logResults(json){
  console.log(json);
  // get the sold and unsold as one object. Skipping the messy name Firebase creates
  var jsonPruned = json[Object.keys(json)[0]];
  console.log(jsonPruned);

  makeGraphs(jsonPruned);
}

function makeGraphs(data){
    var fw = data.sold.fw;
    console.log(d3);

    var width = 960;
    var height = 500;

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(fw, function(d){
        var num = currencyToNumber(d.bPrice);
        return num;
    })]);

    var chart = d3.select("#currentDayData")
                //the w and height are applied
                .attr("width", width)
                .attr("height", height);



    //set the y domain from 0 to max number
    /*
    y.domain([0, d3.max(fw, function(d){
        var num = currencyToNumber(d.bPrice);
        return num;
    })]);
    */
    var barWidth = fw.length;

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
            console.log(num);
            console.log(y(num));
            return y(num);})
        .attr("height", function(d){
            return height - y(currencyToNumber(d.bPrice));
        })
        .attr("width", barWidth -1);

    bar.append("text")
        .attr("x", barWidth/2)
        .attr("y", function(d){ return y(currencyToNumber(d.bPrice));})
        .attr("dy", ".75em")
        .text(function(d){ return d.item;});

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