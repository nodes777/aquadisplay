var db = firebase.database();
var usersRef = db.ref('users');
var leaderboardList = $("#leaderboardList");
var today = getToday();


// This gets allllll the users.
//This could cause slow down in the future with large numbers of users
usersRef.once("value", function(snapshot) {
    users = snapshot.val();
    var leaderboardArr = [];

    // MUST SORT THE USERS SCORE FIRST
    for(user in users){
		let player = users[user];
    	//console.log(player)

    	leaderboardArr.push({"username":player.username, "value": player.stats[today].value})
    }

   	leaderboardArr.sort(function(a, b){
   		console.log(a)
   		return  b.value - a.value
   	});

    leaderboardArr.forEach(function(element){
    	leaderboardList.append(`<li> ${element.username} ${element.value}</li>`)
    })
})







function getToday(){
	var date = new Date(Date.now());

	var dateArray = date.toString().split(" ");
	var dayOfWeek = dateArray[0];
	var dayScraped = dateArray.slice(2,3);
	dayScraped.push(dayOfWeek);
	var dayScrapedUrl = dayScraped.join("-");

	var firebaseMonth = dateArray.slice(1,2);
	var firebaseMonthAndYear = firebaseMonth + dateArray.slice(3,4);
	var firebaseMonthDashYear = firebaseMonth +"-" +dateArray.slice(3,4);

	var firebaseMonthPath = firebaseMonthDashYear.toString();

	var dateString = `${firebaseMonthPath}-${dayScrapedUrl}`;
	console.log(dateString);
	return dateString;
}