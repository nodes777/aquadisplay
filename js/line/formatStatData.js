function formatStatData(json){
	var thirtyDayLineObj = {};
    thirtyDayLineObj.marketStats = [];
    var maxPoint = 0;
    var parseTime = d3.timeParse("%b-%Y-%d-%a");
    var formatDate = d3.timeFormat("%B %d")
/*
    var marketStats = {
        "avg": avg,
        "item": item,
        "stdDev": stdDev,
        "date": currentDate,
        "salesVolume": salesVolume
    }
*/
	/* Format data, each line/category must be an entry in the array */
	$.each(json, function(date, objectDay){
		/* Within a particular day*/
    	//console.log(date +" + "+ JSON.stringify(objectDay))
    	var fishTypeNames = Object.keys(objectDay); // array of just the names
        var numOfFishTypes = fishTypeNames.length;
    	var date = parseTime(date);
        var runningTotalAvg = 0;
        var runningTotalStdDev = 0;
        var runningTotalSales = 0;
    	//console.log(date)

    	$.each(fishTypeNames, function(index, fishTypeName){
    		/* Within a particular fish type*/
    		// Just leave if its the timestamp
    		if(fishTypeName === "timestamp"){ return;}
    		// Create the empty array if there isn't an array there yet
    		if(thirtyDayLineObj[fishTypeName] === undefined){
    			thirtyDayLineObj[fishTypeName] = [];
    		}

    		var avg = objectDay[fishTypeName].avg;
            // Check the max point for y domain
            if(avg > maxPoint){ maxPoint = avg;}

            // Create stats
    		var item = fishTypeName;
    		var currentDate = date;
    		var stdDev = objectDay[fishTypeName].stdDev;
    		var salesVolume = objectDay[fishTypeName].salesVolume;

    		lineFishTypeObj = {
		        "avg": avg,
		        "item": item,
		        "stdDev": stdDev,
		        "date": currentDate,
		        "salesVolume": salesVolume
		     };
            // Add that days stats to the array for the fishtype within the 30day obj
			thirtyDayLineObj[fishTypeName].push(lineFishTypeObj);
            // For the averages of averages, add to the running total
            runningTotalAvg += avg;
            runningTotalStdDev += stdDev;
            runningTotalSales += salesVolume;
    	})

        // Create the market averages for the day
        var dayAvg = runningTotalAvg/numOfFishTypes;
        var dayStdDev = runningTotalStdDev/numOfFishTypes;
        var daySalesVol = runningTotalSales/numOfFishTypes;
        // Add the stats to the day
        thirtyDayLineObj.marketStats.push({avg:+dayAvg.toFixed(2), item:"Market Stats", date:date, stdDev:+dayStdDev.toFixed(2), salesVolume:+daySalesVol.toFixed(2)})
      });
    makeLineGraph(thirtyDayLineObj, maxPoint);
}
