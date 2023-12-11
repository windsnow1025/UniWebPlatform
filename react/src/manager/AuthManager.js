import axios from "axios";

export class AuthManager {
  async fetchUsername() {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    try {
      const res = await axios.get('/api/auth/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      localStorage.removeItem('token');
      return null;
    }
  }
}