firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(`User uid: ${user.uid}`);
    console.log(`User Name: ${user.displayName}`)

    var userId = firebase.auth().currentUser.uid;

	initPortfolio(userId);

  } else {
    console.log(`User not signed in`)
  }
});


// Get a reference to the database service
var database = firebase.database();

/*------------------------------------------------
* Function Definitions
*-------------------------------------------------
*/
function writeUserPortfolio(userId, portfolio) {
  firebase.database().ref('users/' + userId).update({
    portfolio: portfolio
  });
}

// save the user's profile into Firebase so we can list users,
// use them in Security and Firebase Rules, and show profiles
function writeUserData(userId, name, email, imageUrl, portfolio) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email
    //portfolio: portfolio
  });
}

function getUserPortfolio(userId) {
  firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
	  var portfolio = snapshot.val().portfolio;
	  console.log(`Portfolio: ${JSON.stringify(portfolio)}`)
	  return portfolio;
	});
}

function getUserInfo(userId) {
  	firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  		console.log(snapshot.val())
	  	return snapshot.val()
	})
}

// Make sure to wrap this in an if check. This overwrites the users data
function initPortfolio(userId){

	firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
	  var portfolio = snapshot.val().portfolio;
	  //console.log(`Portfolio: ${JSON.stringify(portfolio)}`)


	  if(portfolio === null || undefined){
	  	console.log(`User has no portfolio; initting`)
		  	var fishTypes = Object.keys(fishTypePairs);

			var portfolio = {
					cash: 500,
					aggStats: {
						"value": 0,
						"avg": 0,
						"shares": 0,
					}
				};

			for (const key of fishTypes) {
				if(key !== "Avg"){
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
				}
			writeUserPortfolio(userId, portfolio)
			applyPortfolio(userId, portfolio); // in applyPortfolio.js
		} else {
			console.log("User has a portfolio already")
			getUserInfo(userId)
			applyPortfolio(userId, portfolio); // in applyPortfolio.js
		}
	});
}

