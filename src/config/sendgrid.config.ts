import { registerAs } from '@nestjs/config';

export default registerAs('sendGrid', () => ({
  key: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.SENDGRID_EMAIL_FROM,
}));
