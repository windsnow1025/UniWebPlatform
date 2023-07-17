import axios from 'axios';

// export function parseJwt(token) {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
//
//     return JSON.parse(jsonPayload);
// }

export async function getUsername() {
    const token = localStorage.getItem('token');
    // if (token) {
    //     const payload = parseJwt(token);
    //     return payload.sub;
    // }
    // return null;
    try {
        const res = await axios.get('/api/auth-api/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (err) {
        return null;
    }
}

export async function handleAuth() {
    // Get elements
    const loginButton = document.getElementById("loginButton");
    const loggedInUsername = document.getElementById("loggedInUsername");
    const SignOutButton = document.getElementById("SignOutButton");

    // Add event listeners
    SignOutButton.onclick = function () {
        localStorage.removeItem('token');
        handleAuth();
    };

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