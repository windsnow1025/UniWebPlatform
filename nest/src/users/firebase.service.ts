import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth';

@Injectable()
export class FirebaseService {
  private readonly auth: Auth;
  private readonly firebaseUserPassword = 'FirebaseUserPassword';

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

  async createFirebaseUser(email: string) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      this.firebaseUserPassword,
    );
    return userCredential.user;
  }

  async sendFirebaseEmailVerification(email: string) {
    const user = await this.signInFirebaseUser(
      email,
      this.firebaseUserPassword,
    );
    await sendEmailVerification(user);
  }

  async checkEmailVerified(email: string): Promise<boolean> {
    const user = await this.signInFirebaseUser(
      email,
      this.firebaseUserPassword,
    );
    if (!user.emailVerified) {
      return false;
    }
    await deleteUser(user);
    return true;
  }

  async verifyFirebaseUser(email: string, password: string) {
    try {
      const user = await this.signInFirebaseUser(email, password);
      await deleteUser(user);
    } catch {
      return false;
    }
    return true;
  }

  async sendFirebasePasswordResetEmail(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }
}
