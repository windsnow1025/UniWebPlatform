import axios from "axios";

// Theme
import { initializeTheme } from './theme.js';
initializeTheme();

class User {
    constructor() {
        this.username = null;
        this.password = null;
    }

    getData() {
        this.username = document.getElementById("username").value;
        this.password = document.getElementById("password").value;
    }

    async login() {
        this.getData();
        try {
            // Send login request
            let res = await axios.post("/api/user-api/login", {
                data: { username: this.username, password: this.password }
            });

            // Save token
            localStorage.setItem('token', res.data.token);

            // Redirect to previous URL
            let prevUrl = localStorage.getItem('prevUrl');
            if (prevUrl) {
                window.location.href = prevUrl;
            } else {
                window.location.href = "/"; // default URL if no previous URL was stored
            }
        } catch (err) {
            if (err.response.status == 401) {
                alert("Invalid Username or Password");
            } else {
                alert("Login Fail");
                console.error(err);
            }
        }
    }

    isValidInput(input) {
        // Check if input contains only ASCII characters and has a length between 6 and 20
        const asciiRegex = /^[\x00-\x7F]{4,32}$/;
        return asciiRegex.test(input);
    }

    async signup() {
        this.getData();
        if (!this.isValidInput(this.username) || !this.isValidInput(this.password)) {
            alert("Username or Password contains invalid characters or has an invalid length.");
            return;
        }
        try {
            await axios.post("/api/user-api/signup", {
                data: { username: this.username, password: this.password }
            });
            alert("Signup Success");
        } catch (err) {
            if (err.response.status == 401) {
                alert("Username already exists.");
            } else {
                alert("Signup Fail");
                console.error(err);
            }
        }
    }
}


const user = new User();
const loginButton = document.getElementById("login");
const signupButton = document.getElementById("signup");
loginButton.onclick = user.login.bind(user);
signupButton.onclick = user.signup.bind(user);

// Bind Enter to login button
document.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        loginButton.click();
    }
});