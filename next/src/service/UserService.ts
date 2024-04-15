import axios, {AxiosInstance} from 'axios';

export default class UserService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NODE_API_BASE_URL });
  }

  async signIn(username: string, password: string): Promise<string> {
    const res = await this.axiosInstance.post("/user/sign-in", {
      username: username,
      password: password
    });
    return res.data.token;
  }

  async signUp(username: string, password: string) {
    await this.axiosInstance.post("/user/sign-up", {
      username: username,
      password: password
    });
  }

  async fetchUsername(): Promise<string> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get('/user/', {
      headers: {Authorization: token}
    });
    return res.data.username;
  }

  async updateUser(username: string, password: string) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put(`/user/`, {
      username: username,
      password: password
    }, {
      headers: {Authorization: token}
    });
  }

  async fetchCredit(): Promise<number> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get("/user/credit", {
      headers: {Authorization: token}
    });
    return res.data.credit;
  }

  async fetchPin(): Promise<number> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get('/user/pin', {
      headers: {Authorization: token}
    })
    return res.data.pin;
  }

  async updatePin(pin: number) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put(`/user/pin`, {
      pin: pin
    }, {
      headers: {Authorization: token}
    })
  }
}
