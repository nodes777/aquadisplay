checkForLocalStorageSupport();
console.log("statArr: "+statArr);
var todaysPrices = {};

//localStorage.clear();
//initLocalStorage();
if(localStorage === undefined){
	initLocalStorage();
}

function initLocalStorage(){
	var fishTypes = Object.keys(fishTypePairs);

	var portfolio = {};
	localStorage.setItem( 'cash', JSON.stringify(500) );
	portfolio.value = 0; // Total of all values of all owned fishStocks
	portfolio.avg = 0; // Avg

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

console.log(JSON.parse(localStorage.getItem('portfolio')));

//makePurchase('fw', 2);

function makePurchase(fishType, shares){
	// reduce cash
	var beforeCash = localStorage.getItem('cash');
	var paid = (todaysPrices[fishType].price * shares);
	var afterCash = beforeCash - paid;

	localStorage.setItem('cash', JSON.stringify(afterCash));

	// add to portfolio
	addToPortfolio(fishType, shares, paid);
}

function addToPortfolio(fishType, sharesBought){
	var p = JSON.parse( localStorage.getItem('portfolio'));
	p[fishType].shares += sharesBought;
	p[fishType].paid += paid;
	//"quote": 0, // Current value per share of a fish stock - Changes each day
	//    	"dollarChange": 0, // Dollar value changed since the purchase - Changes each day
	//    	"percentChange": 0, // Percent changed since the purchase - Changes each day
	 //   	"value": 0, // Value of number of shares at todays price - Changes each day
	 //   	"weight": 0 // How much that category affects the whole portfolio
	localStorage.setItem( 'portfolio', JSON.stringify(p) );
}


function setTodaysPrices(statArr){
	for( var fishType of statArr){
		todaysPrices[fishType.fishTypeName] = {
			"fishType":fishType.fishTypeName,
			"name": fishType.item,
			"price":fishType.avg
		};
	}
	console.log(todaysPrices);
}
