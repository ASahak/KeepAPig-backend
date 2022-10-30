import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SendgridService } from './mail.service';
import { MailResolver } from './mail.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import SendGridConfig from '@/config/sendGrid.config';
import UserService from '@/modules/user/user.service';
import { UserRepository } from '@/repositories/user-repository';
import { User, UserSchema } from '@/modules/user/schema/user.schema';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forFeature(SendGridConfig),
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
  controllers: [],
  providers: [
    UserRepository,
    UserService,
    SendgridService,
    MailResolver,
    JwtStrategy,
  ],
  exports: [SendgridService],
})
export class MailModule {}
