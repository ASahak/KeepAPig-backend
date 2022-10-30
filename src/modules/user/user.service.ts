import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { from, map, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { UserDocument, User } from './schema/user.schema';
import { UserRepository } from '@/repositories/user-repository';
import FetchUserDto from '@/modules/user/dto/fetch-user.dto';
import { MESSAGES } from '@/common/enums';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private userRepository: UserRepository,
  ) {}

  public doesUserExist(params, withUser?): Observable<boolean | User> {
    return from(this.userRepository.find(params)).pipe(
      map((user: User) => {
        return withUser ? user : !!user;
      }),
    );
  }

  public fetchUser(userDto: FetchUserDto): Observable<User> {
    return this.doesUserExist({ _id: userDto._id }).pipe(
      switchMap((doesUserExist: boolean) => {
        if (doesUserExist) {
          return this.userRepository.findOneById(userDto._id);
        } else {
          throw new HttpException(MESSAGES.USER.NO_USER, HttpStatus.FORBIDDEN);
        }
      }),
    );
  }

  public updateUser(
    userId: string | MongooseSchema.Types.ObjectId,
    props: Partial<{ [key in keyof User]: User[key] }>,
  ): Observable<User> {
    return from(this.userRepository.update(userId, props));
  }
}
