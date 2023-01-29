import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import AuthService from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import AuthResolver from './auth.resolver';
import { User, UserSchema } from '@/modules/user/schema/user.schema';
import GoogleConfig from '@/config/google.config';
import JwtConfig from '@/config/jwt.config';
import UserService from '@/modules/user/user.service';
import GoogleStrategy from '@/modules/auth/strategies/google.strategy';
import GoogleAuthResolver from '@/modules/auth/oauth/google/google-auth.resolver';
import SessionSerializer from '@/modules/auth/serializers/session.serializer';
import { UserRepository } from '@/repositories/user-repository';

@Module({
  imports: [
    ConfigModule.forFeature(GoogleConfig),
    ConfigModule.forFeature(JwtConfig),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    UserRepository,
    AuthService,
    AuthResolver,
    GoogleAuthResolver,
    JwtStrategy,
    GoogleStrategy,
    UserService,
    SessionSerializer,
  ],
  controllers: [],
  exports: [AuthService, PassportModule, JwtStrategy],
})
export class AuthModule {}
