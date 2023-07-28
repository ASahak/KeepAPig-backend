import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SendgridService } from './mail.service';
import { MailResolver } from './mail.resolver';
// import { ConfigModule } from '@nestjs/config';
// import SendGridConfig from '@/config/sendGrid.config';
import UserService from '@/modules/user/user.service';
import { UserRepository } from '@/repositories/user-repository';
import { User, UserSchema } from '@/modules/user/schema/user.schema';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // ConfigModule.forFeature(SendGridConfig),
    CloudinaryModule,
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
