import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth';

@Injectable()
export class FirebaseService {
  private readonly auth: Auth;

  constructor(private readonly configService: ConfigService) {
    const firebaseConfig =
      this.configService.get<FirebaseOptions>('firebaseConfig')!;
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
  }

  private async signInFirebaseUser(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    return this.auth.currentUser!;
  }

  async createFirebaseUser(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    return userCredential.user;
  }

  async sendFirebaseEmailVerification(email: string, password: string) {
    const user = await this.signInFirebaseUser(email, password);
    await sendEmailVerification(user);
  }

  async checkEmailVerified(email: string, password: string): Promise<boolean> {
    const user = await this.signInFirebaseUser(email, password);
    if (!user.emailVerified) {
      return false;
    }
    await deleteUser(user);
    return true;
  }
}
