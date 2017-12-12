checkForLocalStorageSupport();
var todaysPrices = {};

//localStorage.clear();
//initLocalStorage();
if(localStorage === undefined){
	initLocalStorage();
}

function prepTransactions(){
	addFishTypeListToBuyTable();
  	$("#buyButton").on("click", function(e){
  		handleBuy();
  	})
  	$("#numberToBuy").on("change", function(e){
  		updateTotal();
  	})
}

function initLocalStorage(){
	var fishTypes = Object.keys(fishTypePairs);

	var portfolio = {};
	localStorage.setItem( 'cash', JSON.stringify(500) );
	portfolio.value = 0; // Total of all values of all owned fishStocks
	portfolio.avg = 0; // Avg of value and all shares

	for (const key of fishTypes) {
	    portfolio[key] = {
	    	"shares": 0, // Units of fish stock - Changes on bought and sold
	    	"paid": 0, // Total amount of money put into that fish type - Changes on bought and sold
	    	"quote": 0, // Current value per share of a fish stock - Changes each day
	    	"dollarChange": 0, // Dollar value changed since the purchase - Changes each day
	    	"percentChange": 0, // Percent changed since the purchase - Changes each day
	    	"value": 0, // Value of number of shares at todays price - Changes each day
	    	"weight": 0 // How much that fish stock affects the whole portfolio. Found by dividing the dollar value of a security by the total dollar value of the portfolio
	    };
	}

	localStorage.setItem( 'portfolio', JSON.stringify(portfolio) );
	console.log(localStorage);
}

//console.log(JSON.parse(localStorage.getItem('portfolio')));

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
          updateBuyOptions(selectionName);
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

