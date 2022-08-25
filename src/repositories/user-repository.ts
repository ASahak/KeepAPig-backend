import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@repositories/base/base.abstract.repository';
import { UserRepositoryInterface } from '@repositories/interfaces/user.repository.interface';
import { UserDocument, User } from '@modules/user/schema/user.schema';

@Injectable()
export class UserRepository extends BaseRepository<User> implements UserRepositoryInterface {

  constructor(
    @InjectModel(User.name) private readonly userRepository: Model<UserDocument>,
  ) {
    super(userRepository);
  }

}
