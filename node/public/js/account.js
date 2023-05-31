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

    async signup() {
        this.getData();
        if (this.username == "" || this.password == "") {
            this.prompt.innerHTML = "Username or Password is empty";
            console.log("Username or Password is empty");
            return;
        }
        axios.post("/api/user-api", {
            data: { username: this.username, password: this.password }
        }).then(res => {
            this.prompt.innerHTML = "Signup Success";
            console.log(res.data);
        }).catch(err => {
            this.prompt.innerHTML = "Signup Fail";
            console.error(err);
        })
    }
}


var account = new Account();
var loginButton = document.getElementById("login");
var signupButton = document.getElementById("signup");
loginButton.onclick = account.login.bind(account);
signupButton.onclick = account.signup.bind(account);
