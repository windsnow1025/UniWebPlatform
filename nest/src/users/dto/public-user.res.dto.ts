import { Role } from '../../common/enums/role.enum';

export class PublicUserResDto {
  id: number;
  username: string;
  roles: Role[];
  credit: number;
}
