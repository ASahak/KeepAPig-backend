import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.JWT_EXPIRES_IN,
  expiresInNotRemembered: process.env.JWT_EXPIRES_IN_NOT_REMEMBERED,
}));
