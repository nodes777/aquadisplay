function updatePortfolio(portfolioData){
	// Get portfolio
	var portfolioData = portfolioData;

    var runningTotalOfValue = 0;
    var runningTotalOfShares = 0;
    var dollarChange = 0;
    var price;
	//Update each fish, check for not being stats
    for (fishType in portfolioData) {
    	if(fishType != 'aggStats' && fishType != 'cash') {
    		price = getPriceOf(fishType);
	    	portfolioData[fishType].value = portfolioData[fishType].shares*(price);
	        portfolioData[fishType].quote = price;
	        //portfolioData[fishType].weight = // (portfolioData[fishType].value/portfolioData.value) portfolioData.value is out of date at this point.
	        dollarChange = portfolioData[fishType].value - portfolioData[fishType].paid;
	        portfolioData[fishType].dollarChange = `$ ${dollarChange}`;
	        portfolioData[fishType].percentChange = `${(((dollarChange/portfolioData[fishType].paid).toFixed(2))*100)} %`;

	        runningTotalOfValue += portfolioData[fishType].value;
	        runningTotalOfShares = runningTotalOfShares + portfolioData[fishType].shares;
    	}
    }

    // Update aggregate stats
    portfolioData.aggStats.value = runningTotalOfValue;
    portfolioData.aggStats.avg = (runningTotalOfValue/runningTotalOfShares).toFixed(2);
    portfolioData.aggStats.shares = runningTotalOfShares;

    // Apply weight since it was dependent on getting the totals first. Inefficient to loop through these all again
    for (fishType in portfolioData) {
    	if(fishType != 'value' && fishType != 'avg' && fishType != 'Avg') {
	        portfolioData[fishType].weight = (portfolioData[fishType].value/portfolioData.aggStats.value).toFixed(2);
    	}
    }

	// Apply changes to portfolio
    writeUserPortfolio(uid, portfolioData)
    createTable(portfolioData)
	renderAggStats(portfolioData);
    updateSellTable(portfolioData)
}