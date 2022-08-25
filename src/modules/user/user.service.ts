import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { from, map, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { UserDocument, User } from './schema/user.schema';
import { UserRepository } from '@repositories/user-repository';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private userRepository: UserRepository,
  ) {}

  public doesUserExist(params): Observable<boolean> {
    return from(this.userRepository.find(params)).pipe(
      map((user: User) => {
        return !!user;
      }),
    );
  }

  private fetchUser(userId: string): Observable<User> {
    return this.doesUserExist({ id: userId }).pipe(
      switchMap(async (doesUserExist: boolean) => {
        if (doesUserExist) {
          return this.userRepository.findOneById(userId)
        } else {
          throw new HttpException(
            'There is no user.',
            HttpStatus.FORBIDDEN,
          );
        }
      })
    )
  }

  findOne(id: MongooseSchema.Types.ObjectId) {
    return this.userModel.findById(id);
  }
}
