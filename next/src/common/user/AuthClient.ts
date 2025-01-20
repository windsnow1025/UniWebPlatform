import {getNestAxiosInstance} from "@/src/common/APIConfig";

export default class AuthClient {
  async fetchToken(username: string, password: string): Promise<string> {
    const res = await getNestAxiosInstance().post("/auth/token", {
      username: username,
      password: password
    });
    return res.data.access_token;
  }
}
