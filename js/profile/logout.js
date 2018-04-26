$("#logoutLink").click(function(e){
	console.log(e)
	logout();
})

function logout() {
	firebase.auth().signOut().then(function() {
	  console.log('Signed Out');
	}, function(error) {
	  console.error('Sign Out Error', error);
	});
}

