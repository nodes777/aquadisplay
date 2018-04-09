var todaysPrices = {};

/* Called in makeStatsGraph after sorting the stats data*/
function setTodaysPrices(statArr){
	for( var fishType of statArr){
		todaysPrices[fishType.fishTypeName] = {
			"fishType":fishType.fishTypeName,
			"name": fishType.item,
			"price":fishType.avg
		};
	}
	//console.log("Today's Prices: \n"+JSON.stringify(todaysPrices));
}

function addFishTypeListToBuyTable(){
	// Using todaysPrices, instead of fishTypePairs, to ensure no zero dollar fish can be purchased
	var fishTypeNames = Object.keys(todaysPrices);
	var selector = d3.select("#buyList")
      .append("select")
      .attr("id","buyListDropDown")
      .on("change", function(d) {
          var selectionName = document.getElementById("buyListDropDown").value;// string
          updateBuyOptions(selectionName, updateTotal);
          }, {passive: true});

    selector.selectAll("option")
      .data(fishTypeNames)
      .enter().append("option")
      .attr("value", function(d){
        return d;
      })
      .text(function(d){
        return getReadableName(d);
      });
}

function updateSellTable(p){
  // Using what's present in portfolio, removing the cash and aggStats
  var fishTypeNames = Object.keys(p).filter(function(item){
      if(item != "cash" && item != "aggStats"){
        return item;
      }
  });

  var selector = d3.select("#sellList")
      .append("select")
      .attr("id","sellListDropDown")
      .on("change", function(d) {
          let selectionName = document.getElementById("sellListDropDown").value;// string
          updateSellOptions(selectionName, updateTotal);
          }, {passive: true});

    selector.selectAll("option")
      .data(fishTypeNames)
      .enter().append("option")
      .attr("value", function(d){
        return d;
      })
      .text(function(d){
        return getReadableName(d);
      });
}

function prepTransactions(){
	addFishTypeListToBuyTable();
  	$("#buyButton").on("click", function(e){
  		handleBuy();
  	})
    $("#sellButton").on("click", function(e){
      handleSell();
    })
  	$("#numberToBuy").on("change", function(e){
  		updateTotal();
  	})

  	// init the first buy option on load
  	updateBuyOptions(todaysPrices[Object.keys(todaysPrices)[0]].fishType)
}
