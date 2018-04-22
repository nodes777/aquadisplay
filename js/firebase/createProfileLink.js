firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
    // User is signed in.
    var displayName = user.displayName;
    let uid = user.uid;

    var profileLink = document.getElementById("loginLink");
    profileLink.innerText = user.displayName;
    profileLink.href = "./profile.html";
  } else {
    // User is signed out.
    console.log("User is not logged in")
  }
});

