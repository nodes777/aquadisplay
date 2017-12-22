function updatePortfolio(){
	// Get portfolio
	var portfolioData = JSON.parse( localStorage.getItem('portfolio'));
    console.log(portfolioData);

    var runningTotalOfValue = 0;
    var runningTotalOfShares = 0;
    var dollarChange = 0;
    var price;
	//Update each fish, check for not being stats
    for (fishType in portfolioData) {
    	if(fishType != 'aggStats') {
    		price = getPriceOf(fishType)
	    	portfolioData[fishType].value = portfolioData[fishType].shares*(price);
	        portfolioData[fishType].quote = price;
	        //portfolioData[fishType].weight = // (portfolioData[fishType].value/portfolioData.value) portfolioData.value is out of date at this point.
	        dollarChange = portfolioData[fishType].value - portfolioData[fishType].paid;
	        portfolioData[fishType].dollarChange = `$ ${dollarChange}`;
	        portfolioData[fishType].percentChange = `${(((dollarChange/portfolioData[fishType].paid).toFixed(2))*100)} %`;

	        runningTotalOfValue += portfolioData[fishType].value;
	        console.log(portfolioData[fishType])
	        console.log(portfolioData[fishType].shares)
	        var o = portfolioData[fishType].shares;
	        runningTotalOfShares = runningTotalOfShares + portfolioData[fishType].shares;
	        console.log(portfolioData[fishType].shares)
    	}
    }

    // Update aggregate stats
    portfolioData.aggStats.value = runningTotalOfValue;
    portfolioData.aggStats.avg = runningTotalOfValue/runningTotalOfShares;
    portfolioData.aggStats.shares = runningTotalOfShares;

    // Apply weight since it was dependent on getting the totals first. Inefficient to loop through these all again
    for (fishType in portfolioData) {
    	if(fishType != 'value' && fishType != 'avg' && fishType != 'Avg') {
	        portfolioData[fishType].weight = (portfolioData[fishType].value/portfolioData.aggStats.value).toFixed(2);
    	}
    }

    console.log(portfolioData);
	// Apply changes to portfolio
	localStorage.setItem( 'portfolio', JSON.stringify(portfolioData) );

	renderAggStats();
}