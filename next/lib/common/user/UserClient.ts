import {getOpenAPIConfiguration} from "@/lib/common/APIConfig";
import {UserResDto, UsersApi, UserResDtoRolesEnum} from "@/client";

export default class UserClient {
  async fetchUsers(): Promise<UserResDto[]> {
    const api = new UsersApi(getOpenAPIConfiguration());
    const res = await api.usersControllerFind();
    return res.data;
  }

  async fetchUser(): Promise<UserResDto> {
    const api = new UsersApi(getOpenAPIConfiguration());
    const res = await api.usersControllerFindOne();
    return res.data;
  }

  async createUser(username: string, email: string, password: string) {
    const api = new UsersApi(getOpenAPIConfiguration());
    await api.usersControllerCreate({ username, email, password });
  }

  async sendEmailVerification(email: string) {
    const api = new UsersApi(getOpenAPIConfiguration());
    await api.usersControllerSendEmailVerification({ email });
  }

  async sendPasswordResetEmail(email: string) {
    const api = new UsersApi(getOpenAPIConfiguration());
    await api.usersControllerSendPasswordResetEmail({ email });
  }

  async updateEmailVerified(): Promise<UserResDto> {
    const api = new UsersApi(getOpenAPIConfiguration());
    const res = await api.usersControllerUpdateEmailVerified();
    return res.data;
  }

  async updateResetPassword(email: string, password: string) {
    const api = new UsersApi(getOpenAPIConfiguration());
    await api.usersControllerUpdateResetPassword({ email, password });
  }

  async updateEmail(email: string) {
    const api = new UsersApi(getOpenAPIConfiguration());
    await api.usersControllerUpdateEmail({ email });
  }

  async updateUsername(username: string) {
    const api = new UsersApi(getOpenAPIConfiguration());
    await api.usersControllerUpdateUsername({ username });
  }

  async updatePassword(password: string) {
    const api = new UsersApi(getOpenAPIConfiguration());
    await api.usersControllerUpdatePassword({ password });
  }

  async updateAvatar(avatar: string) {
    const api = new UsersApi(getOpenAPIConfiguration());
    const res = await api.usersControllerUpdateAvatar({ avatar });
    return res.data;
  }

  async updateUserPrivileges(
    username: string,
    emailVerified: boolean,
    roles: UserResDtoRolesEnum[],
    credit: number
  ) {
    const api = new UsersApi(getOpenAPIConfiguration());
    await api.usersControllerUpdatePrivileges({
      username,
      emailVerified,
      roles,
      credit,
    });
  }

  async deleteUser() {
    const api = new UsersApi(getOpenAPIConfiguration());
    await api.usersControllerDelete();
  }

  async deleteUserById(id: number) {
    const api = new UsersApi(getOpenAPIConfiguration());
    await api.usersControllerDeleteById(id);
  }
}
