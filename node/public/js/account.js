import axios from "axios";

// Theme
import { initializeTheme } from './theme.js';
initializeTheme();

class Account {
    constructor() {
        this.prompt = document.getElementById("prompt");
        this.username = null;
        this.password = null;
    }

    getData() {
        this.username = document.getElementById("username").value;
        this.password = document.getElementById("password").value;
    }

    async login() {
        this.getData();
        await axios.get("/api/user-api").then(res => {
            let isLoggedIn = false;
            res.data.forEach(element => {
                if (this.username == element.username && this.password == element.password) {
                    isLoggedIn = true;
                }
            });
            if (isLoggedIn) {
                document.cookie = "username=" + this.username + "; path=/";
                this.prompt.innerHTML = "Login Success";
                console.log("Login Success");
                window.history.back();
            } else {
                this.prompt.innerHTML = "Login Fail";
                console.log("Login Fail");
            }
        }).catch(err => {
            console.error(err);
        })
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
        axios.post("/api/user-api", {
            data: { username: this.username, password: this.password }
        }).then(res => {
            if (res.data == false) {
                alert("Username already exists.");
                return;
            }
            alert("Signup Success");
            console.log(res.data);
        }).catch(err => {
            alert("Signup Fail");
            console.error(err);
        })
    }
}


var account = new Account();
var loginButton = document.getElementById("login");
var signupButton = document.getElementById("signup");
loginButton.onclick = account.login.bind(account);
signupButton.onclick = account.signup.bind(account);
