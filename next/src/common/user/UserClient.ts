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

  async createUser(username: string, email: string, password: string) {
    await getNestAxiosInstance().post("/users/user", {
      username: username,
      email: email,
      password: password
    });
  }

  async sendEmailVerification(email: string, password: string) {
    await getNestAxiosInstance().post("/users/user/email-verification", {
      email: email,
      password: password
    });
  }

  async updateEmailVerified(username: string, email: string, password: string) {
    await getNestAxiosInstance().put("/users/user/email-verified", {
      username: username,
      email: email,
      password: password
    });
  }

  async updateUsername(username: string) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().put("/users/user/username", {
      username: username,
    }, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateEmail(username: string, email: string, password: string) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().put("/users/user/email", {
      username: username,
      email: email,
      password: password,
    }, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updatePassword(password: string) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().put("/users/user/password", {
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
