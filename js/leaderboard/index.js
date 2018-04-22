var db = firebase.database();
var usersRef = db.ref('users');
var leaderboardList = $("#leaderboardList");
var today = getToday();


// This gets allllll the users.
//This could cause slow down in the future with large numbers of users
usersRef.once("value", function(snapshot) {
    users = snapshot.val();
    var leaderboardArr = [];

    // Grab all the users
    for(user in users){
		let player = users[user];
    	//console.log(player)

    	leaderboardArr.push({"username":player.username, "value": player.stats[today].value})
    }
    //Sort the scores
   	leaderboardArr.sort(function(a, b){
   		return  b.value - a.value
   	});

    leaderboardArr.forEach(function(element, i){
    	console.log(i)
    	//let newLi = leaderboardList.append(`<li class=""> ${element.username} ${element.value}</li>`)
    	let newLi = $(`<li class="invisible"> ${element.username} ${element.value}</li>`).appendTo(leaderboardList);
    	let delay = i*300;

    	//Animate the new li's coming in

    	newLi[0].style.animationDelay = String(delay+"ms");
    	newLi.addClass("w3-animate-bottom")
    	setTimeout(function () {
            newLi.removeClass("invisible")
		}, delay+10);

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