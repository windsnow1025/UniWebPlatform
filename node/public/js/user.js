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

    async signIn() {
        this.getData();
        try {
            // Send sign in request
            let res = await axios.post("/api/user/sign-in", {
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
                alert("Sign In Fail");
                console.error(err);
            }
        }
    }

    isValidInput(input) {
        // Check if input contains only ASCII characters and has a length between 6 and 20
        const asciiRegex = /^[\x00-\x7F]{4,32}$/;
        return asciiRegex.test(input);
    }

    async signUp() {
        this.getData();
        if (!this.isValidInput(this.username) || !this.isValidInput(this.password)) {
            alert("Username or Password contains invalid characters or has an invalid length.");
            return;
        }
        try {
            await axios.post("/api/user/sign-up", {
                data: { username: this.username, password: this.password }
            });
            alert("Sign Up Success");
        } catch (err) {
            if (err.response.status == 401) {
                alert("Username already exists.");
            } else {
                alert("Sign Up Fail");
                console.error(err);
            }
        }
    }

}


const user = new User();
const SignInButton = document.getElementById("signIn");
const SignUpButton = document.getElementById("signUp");
SignInButton.onclick = user.signIn.bind(user);
SignUpButton.onclick = user.signUp.bind(user);
