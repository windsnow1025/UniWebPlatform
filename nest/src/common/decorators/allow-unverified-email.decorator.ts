import { SetMetadata } from '@nestjs/common';

export const ALLOW_UNVERIFIED_EMAIL_KEY = 'allowUnverifiedEmail';
export const AllowUnverifiedEmail = () =>
  SetMetadata(ALLOW_UNVERIFIED_EMAIL_KEY, true);
