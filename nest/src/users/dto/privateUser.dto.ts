import { Role } from '../../common/enums/role.enum';

export class PrivateUserDto {
  id: number;
  username: string;
  roles: Role[];
  credit: number;
  pin: number;
}
