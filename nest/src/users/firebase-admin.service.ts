import admin, { ServiceAccount } from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth } from 'firebase-admin/auth';

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

  async listAllUserUids() {
    const userUids: string[] = [];
    let nextPageToken;

    do {
      const listUsersResult = await this.auth.listUsers(1000, nextPageToken);
      listUsersResult.users.forEach((userRecord) => {
        userUids.push(userRecord.uid);
      });

      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    return userUids;
  }

  async deleteMultipleUsers(uids: string[]) {
    const deleteUsersResult = await this.auth.deleteUsers(uids);

    deleteUsersResult.errors.forEach((err) => {
      console.log(err.error.toJSON());
    });
  }

  async deleteAllUsers() {
    const userUids = await this.listAllUserUids();
    await this.deleteMultipleUsers(userUids);
  }
}
