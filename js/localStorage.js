checkForLocalStorageSupport();
console.log(localStorage);
console.log(localStorage.length);
console.log(statArr);
//localStorage.clear();
if(localStorage.portfolio === undefined){
	initStorage();
}

function initStorage(){
	var fishTypes = Object.keys(fishTypePairs);
	console.log(fishTypes);
	localStorage.portfolio = {};
	localStorage.cash = 500;

	for (const key of fishTypes) {
	    localStorage.portfolio[key] = {
	    	"shares": 0,
	    	"paid": 0,
	    	"quote": 0,
	    	"dollar change": 0,
	    	"percent change": 0,
	    	"cost": 0,
	    	"value": 0,
	    	"return": 0,
	    	"weight": 0
	    };
	}
}

function addToPortfolio(obj){
	localStorage.portfolio.push(obj);
}

/*
localStorage.portfolio[fishType] is a unit, units remain the same unless bought or sold
localStorage.portfolio[fishType].value is a value, changes each day
localStorage.cash is a number, cash only changes when buying and selling.

*/