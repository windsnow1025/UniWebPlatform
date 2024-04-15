import UserService from "../service/UserService";

export class UserLogic {
  private userService: UserService;

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

  async signIn(username: string, password: string) {
    try {
      const token = await this.userService.signIn(username, password);
      localStorage.setItem('token', token);
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        throw new Error("Incorrect Username or Password.");
      } else {
        console.error(err);
        throw new Error("Sign In Fail.");
      }
    }
  }

  async signUp(username: string, password: string) {
    try {
      await this.userService.signUp(username, password);
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        throw new Error("Username already exists.");
      } else {
        console.error(err);
        throw new Error("Sign Up Fail.");
      }
    }
  }

  async updateUser(username: string, password: string) {
    try {
      await this.userService.updateUser(username, password);
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        throw new Error("Username already exists.");
      } else {
        console.error(err);
        throw new Error("Update Fail.");
      }
    }
  }

  validateInput(input: string) {
    const asciiRegex = /^[\x20-\x7F]{4,32}$/;
    return asciiRegex.test(input);
  }
}