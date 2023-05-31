export function getCookie(name) {
    var cookieArr = document.cookie.split("; ");
    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0]) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

export function handleAuth() {
    const loginButton = document.getElementById("loginButton");
    const loggedInUsername = document.getElementById("loggedInUsername");
    const SignOutButton = document.getElementById("SignOutButton");

    SignOutButton.onclick = function () {
        document.cookie = "username=; path=/;";
        location.reload();
    };

    const username = getCookie("username");

    if (username != null && username != "") {
        // Hide login button
        loginButton.style.display = "none";
        // Show username
        loggedInUsername.style.display = "block";
        loggedInUsername.innerHTML = "Welcome: " + username;
        // Show SignOut button
        SignOutButton.style.display = "block";
    }
}