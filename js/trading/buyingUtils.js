/*jshint esversion: 6 */

/*------------------------------------------------
* Buying
*-------------------------------------------------
*/

function handleBuy(){
    var fishType = document.getElementById("buyListDropDown").value;
    var numberToBuy = document.getElementById("numberToBuy").value;
    var pricePerShare = document.getElementById("pricePerShare").textContent;
    if (pricePerShare==0) {
    	alert("Hey, you can't buy at zero dollar value.");
    } else {
    	makePurchase(fishType, numberToBuy);
    }
}


function makePurchase(fishType, shares){
	firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
		var portfolio = snapshot.val().portfolio;
	  	var beforeCash = snapshot.val().portfolio.cash;
	  	var paid = (todaysPrices[fishType].price * shares);
	  	var afterCash = beforeCash - paid;

	  	if(afterCash < 0){
	  		alert("Hey you don't have enough money to make that purchase");
	  		return;
	  	}
	  	//console.log(`Before: ${beforeCash}; Paid: ${paid}; After : ${afterCash}`)

	  	// add to portfolio
		addToPortfolio(fishType, shares, paid, portfolio, afterCash);
	});
}

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
	p[fishType].paid += paid; // Amount of money paid into this fish stock // <CHECK THIS> this will only increment
	p[fishType].value = p[fishType].shares * todaysPrices[fishType].price; // Value of number of shares at todays price - Changes each day

	/* updatePortfolio handles changes that occur by day, ex: p[fishType].quote*/
	updatePortfolio(p);
}

/*------------------------------------------------
* Buying Drop Down
*-------------------------------------------------*/

function updateBuyOptions(fish, cb){
	var perShareHTML = d3.select("#pricePerShare");
	var totalPriceHTML = d3.select("#totalPrice");

	perShareHTML.node().textContent = todaysPrices[fish].price;
	totalPriceHTML.node().textContent = todaysPrices[fish].price;

	// The inital loading of the page calls this function without the cb. Buying will call the cb, updateTotal
	if(cb){cb();}
}


function updateTotalBuy(){
	var totalHTML = document.getElementById("totalPrice");
	var selectionName = document.getElementById("buyListDropDown").value;
	var pricePerShare = getPriceOf(selectionName);
	var numberToBuy = document.getElementById("numberToBuy").value;
	var total = pricePerShare * numberToBuy;
	totalHTML.textContent = total;
}


/*------------------------------------------------
* Selling
*-------------------------------------------------
*/
function handleSell(){
    var fishType = document.getElementById("sellListDropDown").value;
    var numberToSell = document.getElementById("numberToSell").value;
    var valuePerShare = document.getElementById("valuePerShare").textContent;
    if (valuePerShare == 0) {
    	alert("Hey, you can't sell at zero dollar value.");
    } else {
    	makeSale(fishType, numberToSell);
    }
}

function makeSale(fishType, sharesSold){
	firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
		let p = snapshot.val().portfolio;
		let sharesLeft = p[fishType].shares - sharesSold; // subtract the shares sold
		let cashGained = todaysPrices[fishType].price * sharesSold; // find the cash gained

		p[fishType].shares = sharesLeft;
		p.cash = p.cash + cashGained;
		p[fishType].paid = p[fishType].paid - cashGained;  // Reduce amount paid into that fish stock by the amount gained in the sale

		updatePortfolio(p);
	});
}

/*------------------------------------------------
* Selling Drop Down
*------------------------------------------------*/

function updateTotalSell(){
	var totalHTML = document.getElementById("totalSale");
	var selectionName = document.getElementById("sellListDropDown").value;
	var pricePerShare = getPriceOf(selectionName);
	var numberToBuy = document.getElementById("numberToSell").value;
	var total = pricePerShare * numberToBuy;
	totalHTML.textContent = total;
}

function updateSellOptions(fish, cb){
	var perShareHTML = d3.select("#valuePerShare");
	var totalPriceHTML = d3.select("#totalSale");
	var numToSellHTML = d3.select("#numberToSell");
	var price;

	// Set the num to sell to 0 to prevent selling what you don't have
	numToSellHTML.node().value = 0;

	// Set max attribute to only be able to sell
	firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
		var portfolio = snapshot.val().portfolio;
		if(portfolio[fish] !== undefined){
			var numOwned = portfolio[fish].shares;
			if(todaysPrices[fish] == undefined){
				price = 0
			} else {
				price = todaysPrices[fish].price;
			}

			perShareHTML.node().textContent = price;
			totalPriceHTML.node().textContent = price;

			numToSellHTML.node().setAttribute("max", numOwned)
		}
	})
	// The inital loading of the page calls this function without the cb. Selling will call the cb, updateTotal
	if(cb){cb()}
}

/*------------------------------------------------
* Shared
*-------------------------------------------------
*/
function getPriceOf(fish){
	if (!todaysPrices[fish]) {
		//console.log(`${fish} can't be sold today`)
		return 0;
	}
	return todaysPrices[fish].price;
}
