import { Role } from '../../common/enums/role.enum';

export interface JwtPayload {
  sub: string; // userId
  username: string;
  emailVerified: boolean;
  roles: Role[];
}
