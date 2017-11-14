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