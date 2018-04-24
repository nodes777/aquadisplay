firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    firebase.database().ref(`/users/${user.uid}/stats`).orderByChild('timestamp').limitToFirst(30).once('value').then(function(snapshot) {
        let profileThirtyData = transformData(snapshot.val())
        makeProfileLineGraph(profileThirtyData);
    })
  } else {
    console.log(`User not signed in`)
  }
});


function transformData(snapshot){
    let statTypes = [];

    for(date in snapshot){
        let holder = {}
        holder.value = snapshot[date].value;
        holder.shares = snapshot[date].shares;
        holder.date = new Date(snapshot[date].timestamp);
        holder.cash = snapshot[date].cash;

        statTypes.push(holder);
    }

    return statTypes;
}


