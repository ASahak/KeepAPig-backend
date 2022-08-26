import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { from, map, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Model } from 'mongoose';
import { UserDocument, User } from './schema/user.schema';
import { UserRepository } from '@repositories/user-repository';
import FetchUserDto from '@modules/user/dto/fetch-user.dto';

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

  public fetchUser(userDto: FetchUserDto): Observable<User> {
    return this.doesUserExist({ _id: userDto._id }).pipe(
      switchMap((doesUserExist: boolean) => {
        if (doesUserExist) {
          return this.userRepository.findOneById(userDto._id);
        } else {
          throw new HttpException('There is no user.', HttpStatus.FORBIDDEN);
        }
      }),
    );
  }
}
