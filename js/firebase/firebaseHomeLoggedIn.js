firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var uid = user.uid;
    var phoneNumber = user.phoneNumber;
    var providerData = user.providerData;
    let portfolio = user.portfolio;
    user.getIdToken().then(function(accessToken) {
      document.getElementById('account-details').textContent = JSON.stringify({
      displayName: displayName,
      email: email,
      portfolio: portfolio,
      emailVerified: emailVerified,
      phoneNumber: phoneNumber,
      photoURL: photoURL,
      uid: uid,
      accessToken: accessToken,
      providerData: providerData
    }, null, '  ');
  });
  } else {
    // User is signed out.
    console.log("User is not logged in")
  }
});