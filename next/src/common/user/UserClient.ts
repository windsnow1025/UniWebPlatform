import {User} from "@/src/common/user/User";
import {getNestAxiosInstance} from "@/src/common/APIConfig";

export default class UserClient {
  async fetchUsers(): Promise<User[]> {
    const token = localStorage.getItem('token');
    const res = await getNestAxiosInstance().get("/users", {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async fetchUser(): Promise<User> {
    const token = localStorage.getItem('token');
    const res = await getNestAxiosInstance().get("/users/user", {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async createUser(username: string, password: string) {
    await getNestAxiosInstance().post("/users/user", {
      username: username,
      password: password
    });
  }

  async updateUser(username: string, password: string) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().put("/users/user", {
      username: username,
      password: password
    }, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateUserPin(pin: number) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().put("/users/user/pin", {
      pin: pin
    }, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateUserCredit(username: string, credit: number) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().put("/users/user/credit", {
      username: username,
      credit: credit
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async deleteUser() {
    const token = localStorage.getItem('token');
    const res = await getNestAxiosInstance().delete("/users/user", {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async deleteUserById(id: number) {
    const token = localStorage.getItem('token');
    const res = await getNestAxiosInstance().delete(`/users/user/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}
