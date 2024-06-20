import { Role } from '../../common/enums/role.enum';

export class UserDto {
  id: number;
  username: string;
  roles: Role[];
  credit: number;
}
