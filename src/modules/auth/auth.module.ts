import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import AuthService from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import AuthResolver from './auth.resolver';
import { User, UserSchema } from '@modules/users/schema/user.schema';
import GoogleConfig from '@config/google.config';
import JwtConfig from '@config/jwt.config';
import UsersService from '@modules/users/users.service';
import GoogleStrategy from '@modules/auth/strategies/google.strategy';
import GoogleOauthController from '@modules/auth/oauth/google/google-oauth.controller';

@Module({
  imports: [
    ConfigModule.forFeature(GoogleConfig),
    ConfigModule.forFeature(JwtConfig),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    GoogleStrategy,
    UsersService,
  ],
  controllers: [GoogleOauthController],
  exports: [AuthService, PassportModule, JwtStrategy, JwtModule],
})
export class AuthModule {}
