function setupLeaderboardLineGraph(topTenArr){
	let promiseArr = [];
	for(let i = 0; i<topTenArr.length; i++){
		let playerRefStatsPromise = db.ref(`users/${topTenArr[i].uid}/stats`).once("value").then(function(snapshot){
			let username = topTenArr[i].username;
			let obj = {"username": username, "history":snapshot.val()}
			return obj
		});
		promiseArr.push(playerRefStatsPromise)
	}

	Promise.all(promiseArr).then(function(values){
		console.log(values)
		makeLeaderboardLineGraph(values)
	})

}