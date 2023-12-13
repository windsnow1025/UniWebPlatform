import {UserService} from "../service/UserService";

export class UserLogic {
  constructor() {
    this.userService = new UserService();
  }

  async fetchUsername() {
    if (!localStorage.getItem('token')) {
      return null;
    }
    try {
      return await this.userService.fetchUsername();
    } catch (err) {
      localStorage.removeItem('token');
      return null;
    }
  }

  async signIn(username, password) {
    try {
      const token = await this.userService.signIn(username, password);
      localStorage.setItem('token', token);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Invalid Username or Password");
      } else {
        alert("Sign In Fail");
        console.error(err);
      }
    }
  }

  async signUp(username, password) {
    try {
      await this.userService.signUp(username, password);
      alert("Sign Up Success");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("Username already exists.");
      } else {
        alert("Sign Up Fail");
        console.error(err);
      }
    }
  }

  async updateUser(username, password) {
    try {
      await this.userService.updateUser(username, password);
      alert("Update Success");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("Username already exists.");
      } else {
        alert("Update Fail");
        console.error(err);
      }
    }
  }

  isValidInput(input) {
    const asciiRegex = /^[\x20-\x7F]{4,32}$/;
    return asciiRegex.test(input);
  }
}