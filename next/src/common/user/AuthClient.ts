import {getNestAxiosInstance} from "@/src/common/APIConfig";

export default class AuthClient {
  async createTokenByEmail(email: string, password: string): Promise<string> {
    const res = await getNestAxiosInstance().post("/auth/token/email", {
      email: email,
      password: password
    });
    return res.data.access_token;
  }

  async createTokenByUsername(username: string, password: string): Promise<string> {
    const res = await getNestAxiosInstance().post("/auth/token/username", {
      username: username,
      password: password
    });
    return res.data.access_token;
  }
}
