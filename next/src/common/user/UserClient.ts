import {Role, User} from "@/src/common/user/User";
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

  async updateUserCredentials(username: string, password: string) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().put("/users/user/credentials", {
      username: username,
      password: password
    }, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateUserPrivileges(username: string, roles: Role[], credit: number) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().put("/users/user/privileges", {
      username: username,
      roles: roles,
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
