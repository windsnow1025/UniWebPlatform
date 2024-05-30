export interface User {
    id: number;
    username: string;
    password: string;
    roles?: string;
    credit: number;
    pin: number;
}