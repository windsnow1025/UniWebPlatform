import axios from 'axios';

export default class UserService {
  async signIn(username, password) {
    const res = await axios.post("/api/user/sign-in", {
      username: username,
      password: password
    });
    return res.data.token;
  }

  async signUp(username, password) {
    await axios.post("/api/user/sign-up", {
      username: username,
      password: password
    });
  }

  async fetchUsername() {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/auth/', {
      headers: {Authorization: token}
    });
    return res.data;
  }

  async updateUser(username, password) {
    const token = localStorage.getItem('token');
    await axios.put(`/api/user/`, {
      username: username,
      password: password
    }, {
      headers: {Authorization: token}
    });
  }

  async fetchCredit() {
    const token = localStorage.getItem('token');
    const res = await axios.get("/api/user/credit", {
      headers: {Authorization: token}
    });
    return res.data.credit;
  }
}
