firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    let portfolio = user.portfolio;
    user.getIdToken().then(function(accessToken) {
      document.getElementById('account-details').textContent = JSON.stringify({
      displayName: displayName,
      email: email,
      portfolio: portfolio,
    }, null, '  ');
  });
  } else {
    // User is signed out.
    console.log("User is not logged in")
  }
});