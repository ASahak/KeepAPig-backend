import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { from, map, of, Observable, catchError, defer, throwError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { switchMap } from 'rxjs/operators';
import { toDataURL } from 'qrcode';
import * as bcrypt from 'bcrypt';
import { createWriteStream, mkdtempSync } from 'fs';
import { authenticator } from 'otplib';
import { tmpdir } from 'os';
import { join } from 'path';
import { Model, Schema as MongooseSchema } from 'mongoose';
import * as sharp from 'sharp';
import { UserDocument, User } from './schema/user.schema';
import { UserRepository } from '@/repositories/user-repository';
import FetchUserDto from '@/modules/user/dto/fetch-user.dto';
import ChangePasswordDto from '@/modules/user/dto/change-password.dto';
import {
  PASSWORD_SALT_ROUNDS,
  MESSAGES,
  VALIDATORS,
  USER_AVATAR_METADATA,
} from '@/common/constants';
import { ErrorInterfaceHttpException } from '@/interfaces/global.interface';
import { generateFileName } from '@/common/utils/handlers';
import { FileUpload } from '@/interfaces/global.interface';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import VerifyUserDto from '@/modules/user/dto/verify-user.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private userRepository: UserRepository,
    private cloudinary: CloudinaryService,
    private readonly configService: ConfigService,
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

  public deletePicture(
    _id: string | MongooseSchema.Types.ObjectId,
  ): Observable<boolean> {
    return this.doesUserExist({ _id }, true).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.updateUser(_id, { avatar: '' }).pipe(
            switchMap((_) => of(true)),
            catchError((_) => {
              throw new HttpException(
                MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
                HttpStatus.FAILED_DEPENDENCY,
              );
            }),
          );
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
    _id: string | MongooseSchema.Types.ObjectId,
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
                      const tempUploads: string = mkdtempSync(
                        join(tmpdir(), 'temp-uploads-'),
                      );
                      const fileName: string = generateFileName(filename);
                      const tempPath: string = join(tempUploads, fileName);
                      const _path: string = join(
                        process.cwd(),
                        `./uploads/${fileName}`,
                      );
                      createReadStream()
                        .pipe(createWriteStream(tempPath))
                        .on('finish', async () => {
                          try {
                            await sharp(tempPath)
                              .resize({
                                width: USER_AVATAR_METADATA.WIDTH,
                                height: USER_AVATAR_METADATA.HEIGHT,
                              })
                              .webp({ quality: USER_AVATAR_METADATA.QUALITY })
                              .toFile(_path);
                            res(_path);
                          } catch (err) {
                            rej(MESSAGES.FILE.IMG_COULD_NOT_BE_RESIZED);
                          }
                        })
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

  public create2faSecret(
    _id: string | MongooseSchema.Types.ObjectId,
  ): Observable<{ otpAuthUrl: string }> {
    return this.doesUserExist({ _id }, true).pipe(
      switchMap((user: User) => {
        if (user) {
          const secret: string = authenticator.generateSecret();
          const otpAuthUrl: string = authenticator.keyuri(
            user.email,
            this.configService.get('jwt.appName2fa'),
            secret,
          );

          return defer(async () => {
            return await toDataURL(otpAuthUrl);
          }).pipe(
            switchMap((res) => {
              return this.updateUser(_id, {
                twoFactorAuthenticationSecret: secret,
              }).pipe(switchMap(() => of({ otpAuthUrl: res })));
            }),
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

  public verifyAuthCode({
    email,
    code,
    returnUser,
  }: VerifyUserDto): Observable<{ success: boolean; user?: User }> {
    return this.doesUserExist({ email }, true).pipe(
      switchMap((user: User) => {
        if (user) {
          const isCodeValid: boolean = authenticator.verify({
            token: code,
            secret: user.twoFactorAuthenticationSecret,
          });
          if (!isCodeValid) {
            return throwError(() => ({
              error: MESSAGES.USER.WRONG_AUTH_CODE,
              statusCode: HttpStatus.FORBIDDEN,
            }));
          }
          return of({ success: true, ...(returnUser ? { user } : {}) });
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
