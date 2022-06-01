import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import AuthService from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import AuthResolver from './auth.resolver';
import { User, UserSchema } from '@modules/users/schema/user.schema';
import JwtConfig from '@config/jwt.config';
import UsersService from '@modules/users/users.service';

@Module({
    imports: [
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
    providers: [AuthService, AuthResolver, JwtStrategy, UsersService],
    exports: [AuthService, PassportModule, JwtStrategy, JwtModule],
})
export class AuthModule {
}
