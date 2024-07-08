export enum Role {
    User = 'user',
    Admin = 'admin',
}

export interface User {
    id: number;
    username: string;
    password: string;
    roles: Role[];
    credit: number;
    pin: number;
}