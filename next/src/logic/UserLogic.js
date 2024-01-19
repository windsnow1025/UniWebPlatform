import UserService from "../service/UserService";

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
        throw new Error("Incorrect Username or Password.");
      } else {
        console.error(err);
        throw new Error("Sign In Fail.");
      }
    }
  }

  async signUp(username, password) {
    try {
      await this.userService.signUp(username, password);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        throw new Error("Username already exists.");
      } else {
        console.error(err);
        throw new Error("Sign Up Fail.");
      }
    }
  }

  async updateUser(username, password) {
    try {
      await this.userService.updateUser(username, password);
      alert("Update Success");
      return true;
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("Username already exists.");
      } else {
        alert("Update Fail");
        console.error(err);
      }
      return false;
    }
  }

  validateInput(input) {
    const asciiRegex = /^[\x20-\x7F]{4,32}$/;
    return asciiRegex.test(input);
  }
}