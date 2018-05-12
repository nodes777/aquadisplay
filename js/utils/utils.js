var tooltipVerbObj = { avg:"Averages", stdDev:"Standard Deviation", salesVolume:"Sales Volume"};

function getCurrentDay(){
	var daysArr = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var d = new Date();
	var day = d.getDate();
	if(day <=9 ){ day = "0"+day;}
	var dayOfWeek = daysArr[d.getDay()];
	var today = day+"-"+dayOfWeek;
	return today;
}

function getCurrentMonth(){
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = new Date();
    var month = monthNames[d.getMonth()];
    var year = d.getFullYear();
    return month+year;
}

function currencyToNumber(bPrice) {
	if(typeof bPrice === "number") {
		return bPrice;
	}
  if(typeof bPrice === "undefined") {
    return 0;
  }
	var currency = bPrice;
  // bPrice comes as a string with dollar sign, remove with regex
  var number = Number(currency.replace(/[^0-9\.-]+/g,""));

  return number;
}

function getWidthOfGraph(id){
  var bb = document.querySelector(id).getBoundingClientRect();
  var width = bb.right - bb.left;

  return width;
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
  var stdDev = d3.deviation(pricesArray);
  if (stdDev === undefined) {stdDev = 0}
  return stdDev;
}

function getAverage(objectArr){
  var pricesArray = objectArr.map(function(d){ return currencyToNumber(d.bPrice);});
  var total = pricesArray.reduce(function(accumulator, currentValue){
   var sum = accumulator + currentValue;
   return  sum;
  }, 0);
  var avg = total/pricesArray.length;
  avg = checkNaN(avg);
  return Math.round(avg);
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function checkNaN (x){
	if(isNaN(x)) {
		return 0;
	} else {
		return x;
	}
}

function getTooltipVerb(graphType){
  return tooltipVerbObj[graphType];
}

function checkForLocalStorageSupport(){
  if (typeof(Storage) === "undefined") {
      console.log("Storage not supported");
      throw "Storage not supported in this browser!";
  }
}

function getReadableDate(today, monthAndYear){
  //31-Sun, Dec2017
  var date = today.split("-")[0];
  var month = monthAndYear.split("2")[0];
  var year = monthAndYear.substring(3);

  var string = ` ${month} ${date}, ${year}`

  return string;

}

function getToday(){
  var date = new Date(Date.now());

  var dateArray = date.toString().split(" ");
  var dayOfWeek = dateArray[0];
  var dayScraped = dateArray.slice(2,3);
  dayScraped.push(dayOfWeek);
  var dayScrapedUrl = dayScraped.join("-");

  var firebaseMonth = dateArray.slice(1,2);
  var firebaseMonthAndYear = firebaseMonth + dateArray.slice(3,4);
  var firebaseMonthDashYear = firebaseMonth +"-" +dateArray.slice(3,4);

  var firebaseMonthPath = firebaseMonthDashYear.toString();

  var dateString = `${firebaseMonthPath}-${dayScrapedUrl}`;
  //console.log(dateString);
  return dateString;
}
var parseTime = d3.timeParse("%b-%Y-%e-%a"); // Structure for converting Apr-2018-27-Fri to Date object
var parseDateObj = d3.timeFormat("%B %d, %Y"); // Converts a date object into a readable string: // "June 30, 2015"


var formatTime = d3.timeFormat("%B %d, %Y");
var formatTimeDashed = d3.timeFormat("%B-%d-%Y");