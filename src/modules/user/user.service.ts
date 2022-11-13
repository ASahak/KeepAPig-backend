import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { from, map, of, Observable, catchError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { UserDocument, User } from './schema/user.schema';
import { UserRepository } from '@/repositories/user-repository';
import FetchUserDto from '@/modules/user/dto/fetch-user.dto';
import ChangePasswordDto from '@/modules/user/dto/change-password.dto';
import { PASSWORD_SALT_ROUNDS, MESSAGES } from '@/common/constants';

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
      catchError((_) => {
        throw new HttpException(
          MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
          HttpStatus.FAILED_DEPENDENCY,
        );
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
      catchError((_) => {
        throw new HttpException(
          MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
          HttpStatus.FAILED_DEPENDENCY,
        );
      }),
    );
  }

  public updateUser(
    userId: string | MongooseSchema.Types.ObjectId,
    props: Partial<{ [key in keyof User]: User[key] }>,
  ): Observable<User> {
    return from(this.userRepository.update(userId, props)).pipe(
      catchError((_) => {
        throw new HttpException(
          MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
          HttpStatus.FAILED_DEPENDENCY,
        );
      }),
    );
  }

  public changePassword({
    password,
    _id,
    token,
  }: ChangePasswordDto): Observable<boolean> {
    return this.doesUserExist({ _id }, true).pipe(
      switchMap((user: User) => {
        if (user) {
          if (user.resetPasswordToken === token) {
            return from(bcrypt.hash(password, PASSWORD_SALT_ROUNDS)).pipe(
              switchMap((password: string) => {
                return from(
                  this.updateUser(_id, { password, resetPasswordToken: null }),
                ).pipe(
                  switchMap((_) => of(true)),
                  // catchError(err => new HttpException(err, HttpStatus.FORBIDDEN))
                );
              }),
            );
          } else {
            throw new HttpException(
              MESSAGES.USER.WRONG_TOKEN,
              HttpStatus.FORBIDDEN,
            );
          }
        } else {
          throw new HttpException(MESSAGES.USER.NO_USER, HttpStatus.FORBIDDEN);
        }
      }),
      catchError((_) => {
        throw new HttpException(
          MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
          HttpStatus.FAILED_DEPENDENCY,
        );
      }),
    );
  }
}
