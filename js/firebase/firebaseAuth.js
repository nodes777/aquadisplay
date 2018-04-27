// Get a reference to the database service
var database = firebase.database();
var uid;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // console.log(`User uid: ${user.uid}`);
    // console.log(`User Name: ${user.displayName}`)
    uid = firebase.auth().currentUser.uid;
	initPortfolio(user);

	document.getElementById("loginLink").innerText = user.displayName;
	document.getElementById("whosPortfolio").innerText = `${user.displayName}'s Portfolio`;
	//document.getElementById("loginLink").href = "Logout or portfolio page?"


  } else {
    console.log(`User not signed in`)
  }
});


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
function writeUserNameAndEmail(userId, name, email, imageUrl, portfolio) {
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
  		//console.log(snapshot.val())
	  	return snapshot.val()
	})
}

// Make sure to wrap this in an if check. This overwrites the users data
function initPortfolio(user){

	firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
		var portfolio;
		if (!snapshot.hasChild("/portfolio")) {
		 				  
		  	console.log(`User has no portfolio; initting`)
		  	var fishTypes = Object.keys(fishTypePairs);

			portfolio = {
					cash: 500,
					aggStats: {
						"value": 0,
						"avg": 0,
						"shares": 0,
					}
				};


			// Send to Firebase
			writeUserNameAndEmail(user.uid, user.displayName, user.email)
			writeUserPortfolio(user.uid, portfolio);
			// Update client side
			updatePortfolio(portfolio);
		} else {
			portfolio  = snapshot.val().portfolio;
			// Check Firebase
			getUserInfo(user.uid)
			// Update client side
			updatePortfolio(portfolio);
		}
	});
}

