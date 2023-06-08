import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Schema as MongooseSchema } from 'mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import IUser, { UserJwtPayload } from '@/interfaces/user.interface';
import { UserRepository } from '@/repositories/user-repository';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(
    @Inject(ConfigService) config: ConfigService,
    @Inject(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.secret2fa'),
    });
  }

  async validate(payload: UserJwtPayload): Promise<IUser> {
    const user = await this.userRepository.findOneById(
      payload.sub as MongooseSchema.Types.ObjectId | string,
    );

    if (!!user) {
      throw new UnauthorizedException();
    }

    if (!user.isEnabledTwoFactorAuth) {
      return user;
    }
    // if (payload.isTwoFactorAuthenticated) { // todo
    //   return user;
    // }
  }
}
