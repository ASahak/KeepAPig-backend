import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { from, map, of, Observable, catchError, defer, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { UserDocument, User } from './schema/user.schema';
import { UserRepository } from '@/repositories/user-repository';
import FetchUserDto from '@/modules/user/dto/fetch-user.dto';
import ChangePasswordDto from '@/modules/user/dto/change-password.dto';
import { PASSWORD_SALT_ROUNDS, MESSAGES, VALIDATORS } from '@/common/constants';
import { ErrorInterfaceHttpException } from '@/interfaces/global.interface';
import { generateFileName } from '@/common/utils/handlers';
import { FileUpload } from '@/interfaces/global.interface';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private userRepository: UserRepository,
    private cloudinary: CloudinaryService,
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
      catchError(() => {
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

  public uploadPicture(
    file: FileUpload,
    _id: string,
  ): Observable<{ success: boolean; secure_url?: string }> {
    return this.doesUserExist({ _id }).pipe(
      switchMap((doesUserExist: boolean) => {
        if (doesUserExist) {
          return defer(async () => {
            return await file;
          }).pipe(
            switchMap(
              ({ createReadStream, filename, mimetype }: FileUpload) => {
                if (!/^image/.test(mimetype)) {
                  return throwError(() => ({
                    error: MESSAGES.FILE.IMG_MIME_TYPE_FAILURE,
                    statusCode: HttpStatus.BAD_REQUEST,
                  }));
                }
                if (!filename.match(VALIDATORS.IMAGE.formatPattern)) {
                  return throwError(() => ({
                    error: MESSAGES.FILE.IMG_FORMAT_NOT_ALLOWED,
                    statusCode: HttpStatus.BAD_REQUEST,
                  }));
                }
                return defer(async () => {
                  try {
                    const path: string = await new Promise((res, rej) => {
                      const _path = join(
                        process.cwd(),
                        `./uploads/${generateFileName(filename)}`,
                      );
                      createReadStream()
                        .pipe(createWriteStream(_path))
                        .on('finish', () => res(_path))
                        .on('error', () =>
                          rej(MESSAGES.FILE.IMG_FORMAT_NOT_ALLOWED),
                        );
                    });
                    const result = await this.cloudinary.uploadImage(path);
                    return { success: true, secure_url: result.secure_url };
                  } catch (err) {
                    throwError(() => ({
                      error: err.message,
                      statusCode: HttpStatus.BAD_REQUEST,
                    }));
                    return { success: false };
                  }
                }).pipe(
                  switchMap(({ success, secure_url }) =>
                    of({ success, secure_url }),
                  ),
                );
              },
            ),
          );
        } else {
          return throwError(() => ({
            error: MESSAGES.USER.NO_USER,
            statusCode: HttpStatus.FORBIDDEN,
          }));
        }
      }),
      catchError(({ error, statusCode }: ErrorInterfaceHttpException) => {
        throw new HttpException(
          error || MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
          statusCode || HttpStatus.FAILED_DEPENDENCY,
        );
      }),
    );
  }
}
