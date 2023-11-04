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

class Signin {
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

}


const signin = new Signin();
const SignInButton = document.getElementById("signIn");
SignInButton.onclick = signin.signIn.bind(signin);
