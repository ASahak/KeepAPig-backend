import { Module } from '@nestjs/common';
import UsersService from './users.service';
import UsersResolver from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
