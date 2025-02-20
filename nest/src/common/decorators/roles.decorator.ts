import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

export const Roles = Reflector.createDecorator<Role[]>();
