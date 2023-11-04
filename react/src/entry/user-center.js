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

class User {
    constructor() {
        this.username = null;
        this.password = null;
    }

    async getUsername() {
        const token = localStorage.getItem('token');
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

    getData() {
        this.username = document.getElementById("username").value;
        this.password = document.getElementById("password").value;
    }

    isValidInput(input) {
        // Check if input contains only ASCII characters and has a length between 6 and 20
        const asciiRegex = /^[\x00-\x7F]{4,32}$/;
        return asciiRegex.test(input);
    }

    async update() {
        this.getData();
        if (!this.isValidInput(this.username) || !this.isValidInput(this.password)) {
            alert("Username or Password contains invalid characters or has an invalid length.");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.put(`/api/user/`, {
                data: { username: this.username, password: this.password }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Update Success");
        } catch (err) {
            if (err.response.status == 409) {
                alert("Username already exists.");
            } else {
                alert("Update Fail");
                console.error(err);
            }
        }
    }
}


const user = new User();
const updateButton = document.getElementById("update");
updateButton.onclick = user.update.bind(user);
document.getElementById("username").value = await user.getUsername();