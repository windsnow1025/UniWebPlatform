import { Role } from '../../common/enums/role.enum';

export class UserResDto {
  id: number;
  username: string;
  roles: Role[];
  credit: number;
}
