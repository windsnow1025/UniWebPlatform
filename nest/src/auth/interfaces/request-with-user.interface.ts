import { Request } from 'express';
import { UserResDto } from '../../users/dto/user.res.dto';

export interface RequestWithUser extends Request {
  user: UserResDto;
}
