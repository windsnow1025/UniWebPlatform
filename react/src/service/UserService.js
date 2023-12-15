import axios from 'axios';

export default class UserService {
  async signIn(username, password) {
    const res = await axios.post("/api/user/sign-in", {
      data: {username, password}
    });
    return res.data.token;
  }

  async signUp(username, password) {
    await axios.post("/api/user/sign-up", {
      data: {username, password}
    });
  }

  async fetchUsername() {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/auth/', {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async updateUser(username, password) {
    const token = localStorage.getItem('token');
    await axios.put(`/api/user/`, {
      data: {username, password}
    }, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async fetchCredit() {
    const token = localStorage.getItem('token');
    const res = await axios.get("/api/user/credit", {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data.credit;
  }
}
