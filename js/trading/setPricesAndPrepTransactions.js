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
          updateBuyOptions(selectionName, updateTotalBuy);
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
  var fishTypeNames = [];
  // Create an array of only fishNames with more than 0 shares
  $.each(p, function(key, value){
   if(key != "cash" && key != "aggStats"){
        if(value.shares>0){
          fishTypeNames.push(key);
        }
      }
  })

  // Doesn't append like the buy Select, selects it directly
  var selector = d3.select("#sellListDropDown");

    selector.attr("id","sellListDropDown")
      .on("change", function(d) {
          let selectionName = document.getElementById("sellListDropDown").value;// string
          updateSellOptions(selectionName, updateTotalSell);
          }, {passive: true});

    var options = selector.selectAll("option") //  Join new data with old elements, if any.
      .data(fishTypeNames);

      options.enter().append("option")
      .merge(options) //Update with new dataset if needed
      .attr("value", function(d){
        return d;
      })
      .text(function(d){
        return getReadableName(d);
      });

      options.exit().remove(); // Remove old elements as needed. 
      // updateBuyOptions is in prepTransactions
      updateSellOptions(fishTypeNames[0]);
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
  		updateTotalBuy();
  	})
    $("#numberToSell").on("change", function(e){
      updateTotalSell();
    })

  	// init the first buy option on load
  	updateBuyOptions(todaysPrices[Object.keys(todaysPrices)[0]].fishType)
    //updateSellOptions is in updateSellTable

}
