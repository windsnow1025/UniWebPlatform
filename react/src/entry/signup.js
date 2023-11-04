import axios from "axios";

// Theme
import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeSelect from '../component/ThemeSelect.js';

const theme_div = ReactDOM.createRoot(document.getElementById('theme'));
theme_div.render(
    <React.StrictMode>
        <ThemeSelect />
    </React.StrictMode>
);

class Signup {
    constructor() {
        this.username = null;
        this.password = null;
    }

    getData() {
        this.username = document.getElementById("username").value;
        this.password = document.getElementById("password").value;
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

            // Redirect to previous URL
            let prevUrl = localStorage.getItem('prevUrl');
            if (prevUrl) {
                window.location.href = prevUrl;
            } else {
                window.location.href = "/"; // default URL if no previous URL was stored
            }
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


const signup = new Signup();
const SignUpButton = document.getElementById("signUp");
SignUpButton.onclick = signup.signUp.bind(signup);
