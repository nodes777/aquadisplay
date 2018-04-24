var monthAndYear = getCurrentMonth();
var today = getCurrentDay();

$.ajax({
	  url: "https://aquascraper-data.firebaseio.com/"+monthAndYear+"/"+today+".json?callback=processTodayJsonProfile&print=pretty",
	  dataType: "jsonp",
	  jsonpCallback: "processTodayJsonProfile"
});


function processTodayJsonProfile(json){
  // get the sold and allAuctions as one object. Skipping the messy name Firebase creates
  var jsonPruned = json[Object.keys(json)[0]];

  var soldItems = getSoldItems(jsonPruned.allAuctions);

  sortTodaysPrices(soldItems);

  prepTransactions();
}


function sortTodaysPrices(soldData){
    // create an array to fill with objects
								              // key      value
	$.each(soldData, function(fishTypeName, objectArr){
    	//console.log(fishTypeName +" + "+ objectArr)
      var avg = getAverage(objectArr);
      var realName = getReadableName(fishTypeName);
      var stdDev = getStdDev(objectArr);
      var salesVolume = objectArr.length;
    	avgObj = {
        "avg": avg,
        "item": realName,
        "fishTypeName": fishTypeName,
        "stdDev": stdDev,
        "salesVolume": salesVolume
      };
    	statArr.push(avgObj);
  	});
  	setTodaysPrices(statArr);
}

function getSoldItems(objOfObjs){

    var objOfSold = {};

    $.each(objOfObjs, function( key, value ) {
        var soldItems = value.filter(function(fishSale){
            return fishSale.reserveMet === "Yes";
        });
        objOfSold[key] = soldItems;
    });
   return objOfSold;
}