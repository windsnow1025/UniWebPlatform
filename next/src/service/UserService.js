import axios from 'axios';
export default class UserService {

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NODE_API_BASE_URL });
  }

  async signIn(username, password) {
    const res = await this.axiosInstance.post("/user/sign-in", {
      username: username,
      password: password
    });
    return res.data.token;
  }

  async signUp(username, password) {
    await this.axiosInstance.post("/user/sign-up", {
      username: username,
      password: password
    });
  }

  async fetchUsername() {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get('/user/', {
      headers: {Authorization: token}
    });
    return res.data.username;
  }

  async updateUser(username, password) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put(`/user/`, {
      username: username,
      password: password
    }, {
      headers: {Authorization: token}
    });
  }

  async fetchCredit() {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get("/user/credit", {
      headers: {Authorization: token}
    });
    return res.data.credit;
  }
}
