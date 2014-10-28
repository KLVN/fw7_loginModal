var myApp = new Framework7({ // Options
    modalTitle: 'Security Check', // Title of all Modals
    onAjaxStart: function (xhr) { myApp.showPreloader();}, // Loading Spinner
    onAjaxComplete: function (xhr) { myApp.hidePreloader();}, // ^
});
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

var wrongLogin = false; // false at the beginning
var loggedIn = localStorage.loggedIn; // loggedIn connected to localStorage
function loginModal() { // naming the function
    var modalText = wrongLogin ? 'Wrong username or password' : 'Login with username and password'; // modalText if values not correct and default modalText
    myApp.modalLogin(modalText, function(username, password){ // calling modalLogon
        myApp.showIndicator(); // show Loading Spinner
        $$.post(
            'check-login.php', // path to your PHP Login Check
            {username: username, password: password}, // passing the values of entered username and password
            function (response) { // function on response
                myApp.hideIndicator(); // hide Spinner
                if (response === '1') {
                    localStorage.loggedIn = 'true';
					mainView.router.loadPage('protected.html');
					// if credentials are correct "1" will be the response
					// set localStorage.loggedIn to "true" because everything was correct
					// then load the page "protected.html" (This is the insecure part)
                }
                else {
                    wrongLogin = true;
                    loginModal();
					// if credentials were wrong, set wrongLogin to true (this will change our modalText) and open loginModal again
                }
            }
        );
    });
}
$$('.login-modal').on('click', function () { // if click on class "login-modal" (our button)...
    if (loggedIn) { // and if loggedIn is set...
		mainView.router.loadPage('protected.html') // ...load protected.html
    }
    else { // if loggedIn is not set
        wrongLogin = false, // because we didn't made something wrong
        loginModal(); // open our loginModal
    }
});