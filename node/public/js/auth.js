import axios from 'axios';

const loginButton = document.getElementById("loginButton");
const loggedInUsername = document.getElementById("loggedInUsername");
const SignOutButton = document.getElementById("SignOutButton");

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
        // Hide login button
        loginButton.style.display = "none";
        // Show username
        loggedInUsername.style.display = "block";
        loggedInUsername.innerHTML = username;
        // Show SignOut button
        SignOutButton.style.display = "block";
    }
}