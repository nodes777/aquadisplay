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
        if(player.stats){
            leaderboardArr.push({"username":player.username, "value": player.stats[today].value, "cash": player.stats[today].cash, "avg": player.stats[today].avg, "uid":user});

        }
    }
    //Sort the scores
    leaderboardArr.sort(function(a, b){
        return  b.value - a.value;
    });
    //console.log(leaderboardArr)

    /* Create table and headers */
    var headers = ["Rank", "Name", "Value", "Cash", "Average"];
    var table = document.createElement("TABLE");
    table.id = "leaderboardTable";
    //Add the header row.
    var headerRow = table.insertRow(-1);

    // For each header, add another header cell
    headers.forEach(function(headers) {
        headerCell = document.createElement("TH");
        headerCell.setAttribute("scope","col")
        headerCell.textContent = headers;
        headerRow.appendChild(headerCell);
    })
    // Add the table to the DOM
    var divTable = document.getElementById("leaderboard");
    divTable.appendChild(table);

    // Now that the table has been added, slide in the new rows
    leaderboardArr.forEach(function(element, i){
        let delay = i*250;

        //You can't animate table rows... so each td must be given the animating class
        let newRow = $(`<tr class="invisible"><td class="w3-animate-bottom" style="animation-delay: ${delay}ms"> ${i+1}</td> 
            <td class="w3-animate-bottom" style="animation-delay: ${delay}ms">${element.username} </td>
            <td class="w3-animate-bottom" style="animation-delay: ${delay}ms">${element.value} </td>
            <td class="w3-animate-bottom" style="animation-delay: ${delay}ms">${element.cash} </td>
            <td class="w3-animate-bottom" style="animation-delay: ${delay}ms">${element.avg}</td></tr>`)
            .appendTo(leaderboardTable);

        setTimeout(function () {
            newRow.removeClass("invisible")
        }, delay+10);
    })


    setupLeaderboardLineGraph(leaderboardArr.splice(0,9))
})

























// usersRef.once("value", function(snapshot) {
//     users = snapshot.val();
//     var leaderboardArr = [{"username":"player.username", "value": 500, "cash": 0, "avg": 2}];

//     // Grab all the users
//     for(user in users){
// 		let player = users[user];
//     	//console.log(player)

//     	leaderboardArr.push({"username":player.username, "value": player.stats[today].value, "cash": player.stats[today].cash, "avg": player.stats[today].avg})
//     }
//     //Sort the scores
//    	leaderboardArr.sort(function(a, b){
//    		return  b.value - a.value
//    	});

//     leaderboardArr.forEach(function(element, i){
//     	console.log(element)
//     	//let newLi = leaderboardList.append(`<li class=""> ${element.username} ${element.value}</li>`)
//     	let newRow = $(`<td class="invisible"> ${i+1}</td> <td class="invisible">${element.username} </td>
//             <td class="invisible">${element.value} </td><td class="invisible">${element.cash} </td>
//             <td class="invisible">${element.avg}</td>`).appendTo(leaderboardList);
//     	let delay = i*300;

//     	//Animate the new li's coming in

//     	newRow[0].style.animationDelay = String(delay+"ms");
//     	newRow.addClass("w3-animate-bottom")
//     	setTimeout(function () {
//             newRow.removeClass("invisible")
// 		}, delay+10);

//     })
// })







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