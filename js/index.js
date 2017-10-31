function gotData(data) {
    console.log(data);
}

function getCurrentDay(){
	var daysArr = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var d = new Date();
	var day = d.getDate();
	var dayOfWeek = daysArr[d.getDay()];
	var today = day+"-"+dayOfWeek;
	return today;
}

var today = getCurrentDay();
console.log(today);

function logResults(json){
  console.log(json);
  // get the sold and unsold as one object. Skipping the messy name Firebase creates
  var first = json[Object.keys(json)[0]];
  console.log(first);
}

$.ajax({
  url: "https://aquascraper-data.firebaseio.com/Oct2017/23-Mon.json?callback=logResults&print=pretty",
  dataType: "jsonp",
  jsonpCallback: "logResults"
});