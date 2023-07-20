import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

await fetch('/html/auth.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('user').innerHTML = data;
    });

const SignInSignUpButton = document.getElementById("SignInSignUpButton");
const SignedInUsername = document.getElementById("SignedInUsername");
const SignOutButton = document.getElementById("SignOutButton");

const SignedOutDiv = document.getElementById("signOut");
const SignedInDiv = document.getElementById("signIn");

SignInSignUpButton.addEventListener('click', function (event) {
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
    // Check if user is signed in
    const username = await getUsername();

    // If signed in
    if (username) {
        // Hide signed out div
        SignedOutDiv.style.display = "none";
        // Get username
        SignedInUsername.innerHTML = username;
        // Show signed in div
        SignedInDiv.style.display = "block";
    } else {
        // Hide signed in div
        SignedInDiv.style.display = "none";
        // Remove username
        SignedInUsername.innerHTML = "";
        // Show signed out div
        SignedOutDiv.style.display = "block";
    }
}