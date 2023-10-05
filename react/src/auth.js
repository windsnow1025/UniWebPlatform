import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

async function fetchUserDiv() {
    await fetch('/html/auth.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('user').innerHTML = data;
        });
}


export async function getUsername() {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    try {
        const res = await axios.get('/api/auth/', {
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

export async function initAuth() {
    await fetchUserDiv();

    // Get elements
    const SignInSignUpButton = document.getElementById("SignInSignUpButton");
    const SignOutButton = document.getElementById("SignOutButton");

    // Add event listeners for Sign in / Sign up buttons
    SignInSignUpButton.addEventListener('click', function (event) {
        event.preventDefault(); // prevent the default action
        localStorage.setItem('prevUrl', window.location.href);
        window.location.href = "/html/user.html";
    });

    // Add event listeners for Sign out button
    SignOutButton.onclick = function () {
        localStorage.removeItem('token');
        handleAuth();
    };

    await handleAuth();
}

export async function handleAuth() {
    // Get elements
    const SignedInUsername = document.getElementById("SignedInUsername");
    const SignedOutDiv = document.getElementById("signOut");
    const SignedInDiv = document.getElementById("signIn");

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