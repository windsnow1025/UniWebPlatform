export interface JwtPayload {
  sub: number;
  username: string;
  roles: string[];
}
