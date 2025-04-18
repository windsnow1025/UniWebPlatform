import {getOpenAPIConfiguration} from "@/lib/common/APIConfig";
import {AuthApi} from "@/client";

export default class AuthClient {
  async createTokenByEmail(email: string, password: string): Promise<string> {
    const api = new AuthApi(getOpenAPIConfiguration());
    const res = await api.authControllerCreateTokenByEmail({
      email: email,
      password: password
    });
    return res.data.accessToken;
  }

  async createTokenByUsername(username: string, password: string): Promise<string> {
    const api = new AuthApi(getOpenAPIConfiguration());
    const res = await api.authControllerCreateTokenByUsername({
      username: username,
      password: password
    });
    return res.data.accessToken;
  }
};
