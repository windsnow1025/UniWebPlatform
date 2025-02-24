import UserClient from "./UserClient";
import AuthClient from "@/src/common/user/AuthClient";
import axios from "axios";
import {Role, User} from "@/src/common/user/User";

export default class UserLogic {
  private authService: AuthClient;
  private userService: UserClient;

  constructor() {
    this.authService = new AuthClient();
    this.userService = new UserClient();
  }

  async fetchUsers(): Promise<User[]> {
    try {
      return await this.userService.fetchUsers();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch users.");
    }
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

  async isAdmin(): Promise<boolean> {
    try {
      const user = await this.userService.fetchUser();
      return user.roles.includes(Role.Admin);
    } catch (error) {
      console.error(error);
      return false;
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

  async updateUserCredentials(username: string, password: string) {
    try {
      await this.userService.updateUserCredentials(username, password);
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

  async updateUserPrivileges(username: string, roles: Role[], credit: number) {
    try {
      await this.userService.updateUserPrivileges(username, roles, credit);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
        if (error.response?.status === 404) {
          throw new Error('User not found');
        }
      }
      console.error(error);
      throw new Error('Failed to update privileges');
    }
  }

  async deleteUserById(id: number) {
    try {
      await this.userService.deleteUserById(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to delete user');
    }
  }

  validateInput(input: string) {
    const asciiRegex = /^[\x21-\x7E]{4,32}$/;
    return asciiRegex.test(input);
  }
}