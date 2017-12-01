# TO DO:
* Make a line graph for 30day
* Provide button for drop down


## Averages:
Sort by highest bar?


## Game:
* Store local picks
* Compare to a market average:
	* Create market average
	*

## 30 Day:
* In scraper:
	* Create stats obj per fish type each day
	* Example:
	{
		{
			"fwanabantoid": { "avg": 30, "stdDev":7.1, "salesVolume": 3}
			"fwbettasct": { "avg": 23, "stdDev":2.1, "salesVolume": 5},
		}
	}
	* Push that each day to firebase under newObj name: dayStats
	* Also create a new root level object, called 30day stats, that has the last 30 days worth of stats
	* Each day remove the last element and add the new object