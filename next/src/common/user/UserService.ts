import axios, {AxiosInstance} from 'axios';
import {User} from "@/src/common/user/User";

export default class UserService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NEST_API_BASE_URL });
  }

  async fetchUsers(): Promise<User[]> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get("/users", {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async fetchUser(): Promise<User> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get("/users/user", {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async createUser(username: string, password: string) {
    await this.axiosInstance.post("/users/user", {
      username: username,
      password: password
    });
  }

  async updateUser(username: string, password: string) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put(`/users/user`, {
      username: username,
      password: password
    }, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async deleteUser() {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.delete("/users/user", {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}
