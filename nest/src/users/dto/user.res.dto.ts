import { Role } from '../../common/enums/role.enum';

export class UserResDto {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
  roles: Role[];
  credit: number;
}
