var monthAndYear = getCurrentMonth();
var today = getCurrentDay();
console.log(monthAndYear);
console.log(today);


$.ajax({
  url: "https://aquascraper-data.firebaseio.com/"+monthAndYear+"/"+today+".json?callback=processTodayJson&print=pretty",
  dataType: "jsonp",
  jsonpCallback: "processTodayJson"
});

$.ajax({
  url: 'https://aquascraper-data.firebaseio.com/stats.json?orderBy="timestamp"&limitToLast=30',
  dataType: "jsonp",
  jsonpCallback: "processLineJson"
});


function processTodayJson(json){
  // get the sold and allAuctions as one object. Skipping the messy name Firebase creates
  var jsonPruned = json[Object.keys(json)[0]];

  var soldItems = getSoldItems(jsonPruned.allAuctions);

  makeStatsGraph(soldItems);

  makeCategoryGraphs(soldItems);

  $("#currentDay").append(` ${today} ${monthAndYear}`);
  prepTransactions();
  initPortfolio();
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

function processLineJson(json){

  makeLineGraph(json);

}


//$('#currentDayData').html(JSON.stringify(data,null,4));
/*
  $.each(jsonPruned.sold, function(fishTypeName, object){
    makeCategoryGraphs(object, fishTypeName);
  });


  // this takes time to sort, must be a callback?
  //makeAveragesGraph(selfSortedSold);

    //makeCategoryGraphs(selfSortedSold);
*/