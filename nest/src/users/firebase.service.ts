import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from 'firebase/auth';

@Injectable()
export class FirebaseService {
  private readonly auth: Auth;

  constructor(private readonly configService: ConfigService) {
    const firebaseConfig = {
      apiKey: this.configService.get<string>('firebase.apiKey'),
      authDomain: this.configService.get<string>('firebase.authDomain'),
      projectId: this.configService.get<string>('firebase.projectId'),
      storageBucket: this.configService.get<string>('firebase.storageBucket'),
      messagingSenderId: this.configService.get<string>(
        'firebase.messagingSenderId',
      ),
      appId: this.configService.get<string>('firebase.appId'),
      measurementId: this.configService.get<string>('firebase.measurementId'),
    };
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
