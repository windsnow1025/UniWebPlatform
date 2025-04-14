import admin, { ServiceAccount } from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, UserRecord } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAdminService {
  private readonly auth: Auth;

  constructor(private readonly configService: ConfigService) {
    const serviceAccount =
      this.configService.get<ServiceAccount>('serviceAccountKey')!;
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    this.auth = app.auth();
  }

  async listAllUsers(): Promise<UserRecord[]> {
    const users: UserRecord[] = [];
    let nextPageToken;

    do {
      const listUsersResult = await this.auth.listUsers(1000, nextPageToken);
      users.push(...listUsersResult.users);

      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    return users;
  }

  async deleteUserByEmail(email: string) {
    const userRecord = await this.auth.getUserByEmail(email);
    await this.auth.deleteUser(userRecord.uid);
  }

  async deleteMultipleUsers(uids: string[]) {
    const deleteUsersResult = await this.auth.deleteUsers(uids);

    deleteUsersResult.errors.forEach((err) => {
      console.log(err.error.toJSON());
    });
  }

  async deleteAllUsers() {
    const users = await this.listAllUsers();
    const userUids = users.map((user) => user.uid);
    await this.deleteMultipleUsers(userUids);
  }
}
