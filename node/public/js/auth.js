import axios from 'axios';

await fetch('/html/auth.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('user').innerHTML = data;
    });

const loginButton = document.getElementById("loginButton");
const loggedInUsername = document.getElementById("loggedInUsername");
const SignOutButton = document.getElementById("SignOutButton");

const loggedOutDiv = document.getElementById("loggedOut");
const loggedInDiv = document.getElementById("loggedIn");

loginButton.addEventListener('click', function (event) {
    event.preventDefault(); // prevent the default action
    localStorage.setItem('prevUrl', window.location.href);
    window.location.href = "/html/user.html";
});

export async function getUsername() {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.get('/api/auth-api/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (err) {
        localStorage.removeItem('token');
        return null;
    }
}

export async function init() {

    // Add event listeners
    SignOutButton.onclick = function () {
        localStorage.removeItem('token');
        handleAuth();
    };

    await handleAuth();
}

export async function handleAuth() {
    // Check if user is logged in
    const username = await getUsername();

    // If user is logged in
    if (username) {
        // Hide logged out div
        loggedOutDiv.style.display = "none";
        // Get username
        loggedInUsername.innerHTML = username;
        // Show logged in div
        loggedInDiv.style.display = "block";
    } else {
        // Hide logged in div
        loggedInDiv.style.display = "none";
        // Remove username
        loggedInUsername.innerHTML = "";
        // Show logged out div
        loggedOutDiv.style.display = "block";
    }
}