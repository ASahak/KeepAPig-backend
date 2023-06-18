import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable, of, from, catchError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import CreateUserDto, {
  CreateGoogleUserDto,
} from '@/modules/user/dto/create-user.dto';
import { User } from '@/modules/user/schema/user.schema';
import SignInUserDto from '@/modules/user/dto/sign-in-user.dto';
import UserService from '@/modules/user/user.service';
import IUser, {
  UserJwtPayload,
  GoogleIUser,
} from '@/interfaces//user.interface';
import { AuthUserResponse } from './responses/auth-user.response';
import { UserRepository } from '@/repositories/user-repository';
import { MESSAGES } from '@/common/constants';

@Injectable()
export default class AuthService {
  constructor(
    private jwtTokenService: JwtService,
    private userRepository: UserRepository,
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public createGoogleUser(
    createGoogleCustomerDto: CreateGoogleUserDto,
  ): Observable<Partial<GoogleIUser>> {
    return this.userService
      .doesUserExist({ email: createGoogleCustomerDto.email })
      .pipe(
        switchMap((doesUserExist: boolean) => {
          if (doesUserExist) {
            return this.userRepository.find({
              email: createGoogleCustomerDto.email,
            });
          }
          const { id, avatar, email, fullName, role } = createGoogleCustomerDto;
          return this.userRepository.create({
            email,
            fullName,
            role,
            password: randomStringGenerator(),
            google: { id, avatar, email, fullName },
          });
        }),
        catchError((_) => {
          throw new HttpException(
            MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
            HttpStatus.FAILED_DEPENDENCY,
          );
        }),
      );
  }

  public create(createCustomerDto: CreateUserDto): Observable<IUser> {
    return this.userService
      .doesUserExist({ email: createCustomerDto.email })
      .pipe(
        switchMap((doesUserExist: boolean) => {
          if (doesUserExist) {
            throw new HttpException(
              MESSAGES.USER.USER_EXIST,
              HttpStatus.FORBIDDEN,
            );
          }
          return this.userRepository.create(createCustomerDto);
        }),
        catchError((_) => {
          throw new HttpException(
            MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
            HttpStatus.FAILED_DEPENDENCY,
          );
        }),
      );
  }

  public signInToken = (
    user: Partial<IUser & { rememberMe: boolean }>,
  ): Observable<AuthUserResponse> => {
    const payload: UserJwtPayload = { name: user.fullName, sub: user._id };
    return of(
      new AuthUserResponse({
        user,
        token: this.jwtTokenService.sign(payload, {
          expiresIn: user.rememberMe
            ? this.configService.get('jwt.expiresIn')
            : this.configService.get('jwt.expiresInNotRemembered'),
        }),
      }),
    );
  };

  public login(
    signInUserDto: SignInUserDto,
  ): Observable<IUser | { notVerified: boolean }> {
    return this.userService
      .doesUserExist({ email: signInUserDto.email }, true)
      .pipe(
        switchMap((user: User) => {
          if (user) {
            return from(
              bcrypt.compare(signInUserDto.password, user.password),
            ).pipe(
              switchMap((isSame: boolean) => {
                if (isSame) {
                  return from(
                    this.userRepository.find({
                      email: signInUserDto.email,
                    }),
                  ).pipe(
                    switchMap((user) => {
                      if (user.isEnabledTwoFactorAuth) {
                        if (user.isVerifiedTwoFactorAuth) {
                          return this.userService
                            .updateUser(user._id, {
                              isVerifiedTwoFactorAuth: false,
                            })
                            .pipe(switchMap(() => of(user)));
                        } else {
                          return of({ notVerified: true });
                        }
                      } else {
                        return of(user);
                      }
                    }),
                  );
                } else {
                  throw MESSAGES.USER.USER_PASSWORD_OR_EMAIL_IS_WRONG;
                }
              }),
              catchError((err) => {
                throw new HttpException(err, HttpStatus.FORBIDDEN);
              }),
            );
          } else {
            throw new HttpException(
              MESSAGES.USER.USER_DOES_NOT_EXIST,
              HttpStatus.FORBIDDEN,
            );
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
