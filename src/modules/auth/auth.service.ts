import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import CreateUserDto, {
  CreateGoogleUserDto,
} from '@/modules/user/dto/create-user.dto';
import SignInUserDto from '@/modules/user/dto/sign-in-user.dto';
import UserService from '@/modules/user/user.service';
import IUser, {
  UserJwtPayload,
  GoogleIUser,
} from '@/interfaces//user.interface';
import AuthUserResponse from './responses/auth-user.response';
import { UserRepository } from '@/repositories/user-repository';
import { MESSAGES } from '@/common/enums';

@Injectable()
export default class AuthService {
  constructor(
    private jwtTokenService: JwtService,
    private userRepository: UserRepository,
    private userService: UserService,
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
      );
  }

  public signInToken = (user: Partial<IUser>): Observable<AuthUserResponse> => {
    const payload: UserJwtPayload = { name: user.fullName, sub: user._id };
    return of(
      new AuthUserResponse({
        user,
        token: this.jwtTokenService.sign(payload),
      }),
    );
  };

  public login(signInUserDto: SignInUserDto): Observable<IUser> {
    return this.userService.doesUserExist({ email: signInUserDto.email }).pipe(
      switchMap((doesUserExist: boolean) => {
        if (doesUserExist) {
          return this.userRepository.find({ email: signInUserDto.email });
        } else {
          throw new HttpException(
            MESSAGES.USER.USER_DOES_NOT_EXIST,
            HttpStatus.FORBIDDEN,
          );
        }
      }),
    );
  }
}
