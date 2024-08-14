import UserService from "./UserService";
import AuthService from "@/src/common/user/AuthService";
import axios from "axios";

export default class UserLogic {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  async fetchUsernames(): Promise<string[]> {
    try {
      const users = await this.userService.fetchUsers();
      return users.map(user => user.username);
    } catch (err) {
      console.error(err);
      throw new Error("Failed to fetch usernames.");
    }
  }

  async fetchId() {
    if (!localStorage.getItem('token')) {
      return null;
    }
    try {
      const user = await this.userService.fetchUser();
      return user.id;
    } catch (err) {
      localStorage.removeItem('token');
      return null;
    }
  }

  async fetchUsername() {
    if (!localStorage.getItem('token')) {
      return null;
    }
    try {
      const user = await this.userService.fetchUser();
      return user.username;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status !== 0) {
          localStorage.removeItem('token');
        }
      }
      console.error(error);
      return null;
    }
  }

  async fetchCredit() {
    try {
      const user = await this.userService.fetchUser();
      return user.credit;
    } catch (err) {
      console.error(err);
    }
  }

  async fetchPin() {
    try {
      const user = await this.userService.fetchUser();
      return user.pin;
    } catch (err) {
      console.error(err);
    }
  }

  async signIn(username: string, password: string) {
    try {
      const token = await this.authService.fetchToken(username, password);
      localStorage.setItem('token', token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Incorrect Username or Password');
        }
      }
      console.error(error);
      throw new Error('Sign in failed');
    }
  }

  async signUp(username: string, password: string) {
    try {
      await this.userService.createUser(username, password);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('Username already exists');
        }
      }
      console.error(error);
      throw new Error('Sign up failed');
    }
  }

  async updateUser(username: string, password: string) {
    try {
      await this.userService.updateUser(username, password);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('Username already exists');
        }
      }
      console.error(error);
      throw new Error('Update user failed');
    }
  }

  async updateUserPin(pin: number) {
    try {
      await this.userService.updateUserPin(pin);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error('Unauthorized');
          }
          if (error.response?.status === 403) {
            throw new Error('Forbidden');
          }
        }
        console.error(error);
        throw new Error('Failed to update pin');
      }
    }
  }

  validateInput(input: string) {
    const asciiRegex = /^[\x20-\x7F]{4,32}$/;
    return asciiRegex.test(input);
  }
}