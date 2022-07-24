import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { USER_ROLES } from '@common/enums';
import { GoogleIUser } from '@interfaces/user.interface';

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
  }

  async validate(
    token: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user: GoogleIUser = {
      _id: profile.id,
      email: emails[0].value,
      fullName: name.givenName + ' ' + name.familyName,
      avatar: photos[0].value,
      token: token,
      role: USER_ROLES.USER,
    };
    done(null, user);
  }
}
