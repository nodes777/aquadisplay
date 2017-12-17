function makePurchase(fishType, shares){
	// reduce cash
	var beforeCash = localStorage.getItem('cash');
	var paid = (todaysPrices[fishType].price * shares);
	var afterCash = beforeCash - paid;

	localStorage.setItem('cash', JSON.stringify(afterCash));

	// add to portfolio
	addToPortfolio(fishType, shares, paid);
}

function addToPortfolio(fishType, sharesBought, paid){
	var p = JSON.parse( localStorage.getItem('portfolio'));
	p[fishType].shares += +sharesBought;
	p[fishType].paid += paid; // Amount of money paid into this fish stock
	//		"quote": 0, // Current value per share of a fish stock - Changes each day
	//    	"dollarChange": 0, // Dollar value changed since the purchase - Changes each day
	//    	"percentChange": 0, // Percent changed since the purchase - Changes each day
	p[fishType].value = p[fishType].shares * todaysPrices[fishType].price; // Value of number of shares at todays price - Changes each day
	p.value += p[fishType].value; // adjust the value of the entire portfolio
	var numOfAllSharesB = getTotalNumOfShares();
	console.log("numOfAllSharesB: "+numOfAllSharesB)
	var numOfAllShares = numOfAllSharesB + +sharesBought;
	console.log("numOfAllShares: "+numOfAllShares)
	console.log("p.value: "+p.value)
	console.log(p.value/numOfAllShares)
	p.avg = p.value/numOfAllShares// Update p.avg,p.avg = p.value / numOfAllShares
	p[fishType].weight = (p[fishType].value/p.value) // How much that category affects the whole portfolio

	console.log(p);
	localStorage.setItem( 'portfolio', JSON.stringify(p) );
}

function updateBuyOptions(fish, cb){
	var perShareHTML = d3.select("#pricePerShare");
	var totalPriceHTML = d3.select("#totalPrice");

	perShareHTML.node().innerHTML = todaysPrices[fish].price;
	totalPriceHTML.node().innerHTML = todaysPrices[fish].price;
	// The inital loading of the page calls this function without the cb. Buying will call the cb
	if(cb){cb()}
}

function handleBuy(){
    var fishType = document.getElementById("buyListDropDown").value;
    var numberToBuy = document.getElementById("numberToBuy").value;
    var pricePerShare = document.getElementById("pricePerShare").innerHTML;
    if (pricePerShare==0) {
    	alert("Hey, you can't buy at zero dollar value.")
    } else {
    	makePurchase(fishType, numberToBuy)
    }
}

function updateTotal(){
	var totalHTML = document.getElementById("totalPrice");
	var selectionName = document.getElementById("buyListDropDown").value;
	var pricePerShare = getPriceOf(selectionName);
	var numberToBuy = document.getElementById("numberToBuy").value;
	var total = pricePerShare * numberToBuy;
	totalHTML.innerHTML = total;
}

function getPriceOf(fish){
	return todaysPrices[fish].price;
}

/* returns number of types owned */
function getOwnedNumber(){
	var p = JSON.parse( localStorage.getItem('portfolio'));
	var numOwned = 0
	for(var key in p){
		if(p[key].shares >=1){numOwned++}
	}
	return numOwned;
}

function getTotalNumOfShares(){
	var p = JSON.parse( localStorage.getItem('portfolio'));
	var num = 0;
	for(var key in p){
		if(p[key] !== null && p[key].shares !== undefined){
			num += p[key].shares
		}
	}
	console.log("Num of shares "+ num)
	return num;
}