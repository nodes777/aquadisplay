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
  // get the sold and allAuctions as one object. Skipping the messy name Firebase creates
  var jsonPruned = json[Object.keys(json)[0]];
  console.log(jsonPruned.sold)

  $.each(jsonPruned.sold, function(key, value){
    makeGraph(value, key)
  })
  //makeGraph(jsonPruned);
}



//$('#currentDayData').html(JSON.stringify(data,null,4));
