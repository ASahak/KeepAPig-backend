import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { from, map, of, Observable, catchError, defer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import multer from 'multer';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { FileUpload } from 'graphql-upload-minimal';
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
                  catchError((_) => {
                    throw new HttpException(
                      MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
                      HttpStatus.FAILED_DEPENDENCY,
                    );
                  }),
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

  public uploadPicture(file: any, _id: string): Observable<any> {
    return this.doesUserExist({ _id }).pipe(
      switchMap((doesUserExist: boolean) => {
        if (doesUserExist) {
          defer(async () => {
            return await file;
          }).subscribe(({ createReadStream, filename }) => {
            createReadStream().pipe(createWriteStream(join(process.cwd(), `./src/uploads/${filename}`)))
              .on('finish', () => {
                console.log(1);
              })
              .on('error', () => {
                console.log(2);
              })
          })
          // new Promise((res, rej) => {

          // })
          const storage = multer.diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
              const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
              return cb(null, `${randomName}${file.originalname}`)
            },
          });
          //
          // storage(stream)
          return of(true);
        } else {
          throw new HttpException(MESSAGES.USER.NO_USER, HttpStatus.FORBIDDEN);
        }
      }),
      catchError((_) => {
        console.log(_);
        throw new HttpException(
          MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
          HttpStatus.FAILED_DEPENDENCY,
        );
      }),
    );
  }
}
