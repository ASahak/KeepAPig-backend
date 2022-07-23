import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    jsURL: process.env.GOOGLE_OAUTH_JS_URI,
}));
