import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  appName2fa: process.env.APP_NAME_FOR_2FA,
  secret2fa: process.env.JWT_2FA_SECRET_KEY,
  secret: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.JWT_EXPIRES_IN,
  expiresInNotRemembered: process.env.JWT_EXPIRES_IN_NOT_REMEMBERED,
}));
