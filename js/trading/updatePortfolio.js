function updatePortfolio(){
	// Get portfolio
	var portfolioData = JSON.parse( localStorage.getItem('portfolio'));
    console.log(portfolioData);

    var runningTotalOfValue = 0;
    var runningTotalOfShares = 0;
    var dollarChange = 0;
	//Update each fish, check for not being stats
    for (fishType in portfolioData) {
    	if(fishType != 'value' && fishType != 'avg' && fishType != 'Avg') {
	    	portfolioData[fishType].value = portfolioData[fishType].shares*(getPriceOf(fishType));
	        portfolioData[fishType].quote = getPriceOf(fishType);
	        //portfolioData[fishType].weight = // (portfolioData[fishType].value/portfolioData.value) portfolioData.value is out of date at this point.
	        dollarChange = portfolioData[fishType].value - portfolioData[fishType].paid;
	        portfolioData[fishType].dollarChange = `$ ${dollarChange}`;
	        portfolioData[fishType].percentChange = `${(((dollarChange/portfolioData[fishType].paid).toFixed(2))*100)} %`;

	        runningTotalOfValue += portfolioData[fishType].value;
	        runningTotalOfShares += portfolioData[fishType].shares;
    	}
    }

    // Update aggregate stats
    portfolioData.value = runningTotalOfValue;
    portfolioData.avg = runningTotalOfValue/runningTotalOfShares;

    // Apply weight since it was dependent on getting the totals first. Inefficient to loop through these all again
    for (fishType in portfolioData) {
    	if(fishType != 'value' && fishType != 'avg' && fishType != 'Avg') {
	        portfolioData[fishType].weight = (portfolioData[fishType].value/portfolioData.value).toFixed(2);
    	}
    }


    console.log(portfolioData);
	// Apply changes to portfolio
	localStorage.setItem( 'portfolio', JSON.stringify(portfolioData) );
}