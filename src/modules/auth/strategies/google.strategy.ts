import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import * as passport from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { USER_ROLES } from '@/common/enums';
import { GoogleIUser } from '@/interfaces/user.interface';

type GoogleBodyType<T> = T & { token: string; role: keyof typeof USER_ROLES };

@Injectable()
export default class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      clientID: config.get('google.clientID'),
      clientSecret: config.get('google.clientSecret'),
      callbackURL: config.get('google.callbackURL'),
      scope: ['email', 'profile'],
    });
    passport.use(this);

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  async validate(
    token: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user: GoogleBodyType<GoogleIUser> = {
      id: profile.id,
      email: emails[0].value,
      fullName: name.givenName + ' ' + name.familyName,
      avatar: photos[0].value,
      token: token,
      role: USER_ROLES.USER,
    };
    done(null, user);
  }
}
