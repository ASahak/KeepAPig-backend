import { Module } from '@nestjs/common';
import UserService from './user.service';
import UserResolver from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/modules/user/schema/user.schema';
import { UserRepository } from '@/repositories/user-repository';
import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudinaryModule,
  ],
  providers: [UserRepository, UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
