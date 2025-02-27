import {getNestAxiosInstance} from "@/src/common/APIConfig";

export default class AuthClient {
  async fetchToken(email: string, password: string): Promise<string> {
    const res = await getNestAxiosInstance().post("/auth/token", {
      email: email,
      password: password
    });
    return res.data.access_token;
  }
}
