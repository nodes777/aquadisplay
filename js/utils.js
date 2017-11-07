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
	var currency = bPrice;
    // bPrice comes as a string with dollar sign, remove with regex
    var number = Number(currency.replace(/[^0-9\.-]+/g,""));
    return number;
}

function getWidthOfGraph() {
  var bb = document.querySelector('#firstGraph').getBoundingClientRect();
  var width = bb.right - bb.left;

  return width
}