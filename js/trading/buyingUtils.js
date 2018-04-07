function makePurchase(fishType, shares){
	firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
		var portfolio = snapshot.val().portfolio;
	  	var beforeCash = snapshot.val().portfolio.cash;
	  	var paid = (todaysPrices[fishType].price * shares);
	  	var afterCash = beforeCash - paid;
	  	console.log(`Before: ${beforeCash}; Paid: ${paid}; After : ${afterCash}`)

	  	// add to portfolio
		addToPortfolio(fishType, shares, paid, portfolio, afterCash);
	});
}

/*Making a purchase bug, create table needs to be passed a portfolio*/
function addToPortfolio(fishType, sharesBought, paid, portfolio, afterCash){
	var p = portfolio;
	// update cash
	p.cash = afterCash;
	if(p[fishType] == undefined){
			p[fishType] = {
				"shares": 0, // Units of fish stock - Changes on bought and sold
				"paid": 0, // Total amount of money put into that fish type - Changes on bought and sold
				"quote": 0, // Current value per share of a fish stock - Changes each day
				"dollarChange": 0, // Dollar value changed since the purchase - Changes each day
				"percentChange": 0, // Percent changed since the purchase - Changes each day
				"value": 0, // Value of number of shares at todays price - Changes each day
				"weight": 0 // How much that fish stock affects the whole portfolio. Found by dividing the dollar value of a security by the total dollar value of the portfolio
			};
	}
	p[fishType].shares += +sharesBought;
	p[fishType].paid += paid; // Amount of money paid into this fish stock
	p[fishType].value = p[fishType].shares * todaysPrices[fishType].price; // Value of number of shares at todays price - Changes each day

	/*The below is now updated in initTodaysChangesOnPortfolio()
	//p.value += p[fishType].value; // adjust the value of the entire portfolio

	var numOfAllSharesB = getTotalNumOfShares();
	var numOfAllShares = numOfAllSharesB + +sharesBought;

	//p.avg = p.value/numOfAllShares// Update p.avg,p.avg = p.value / numOfAllShares
	//p[fishType].weight = (p[fishType].value/p.value) // How much that category affects the whole portfolio
	*/
	updatePortfolio(p)
	createTable(p)
}

function updateBuyOptions(fish, cb){
	var perShareHTML = d3.select("#pricePerShare");
	var totalPriceHTML = d3.select("#totalPrice");

	perShareHTML.node().textContent = todaysPrices[fish].price;
	totalPriceHTML.node().textContent = todaysPrices[fish].price;

	// The inital loading of the page calls this function without the cb. Buying will call the cb, updateTotal
	if(cb){cb()}
}

function handleBuy(){
    var fishType = document.getElementById("buyListDropDown").value;
    var numberToBuy = document.getElementById("numberToBuy").value;
    var pricePerShare = document.getElementById("pricePerShare").textContent;
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
	totalHTML.textContent = total;
}

function getPriceOf(fish){
	if (!todaysPrices[fish]) {
		//console.log(`${fish} can't be sold today`)
		return 0;
	}
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