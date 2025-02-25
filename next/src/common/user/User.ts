export enum Role {
  User = 'user',
  Admin = 'admin',
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  roles: Role[];
  credit: number;
}