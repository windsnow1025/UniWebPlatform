import { Role } from '../../common/enums/role.enum';

export class PrivateUserResDto {
  id: number;
  username: string;
  roles: Role[];
  credit: number;
}
