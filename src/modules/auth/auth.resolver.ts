import { Inject } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Observable, switchMap, map } from 'rxjs';
import AuthService from '@/modules/auth/auth.service';
import AuthUserResponse from '@/modules/auth/responses/auth-user.response';
import CreateUserDto from '@/modules/user/dto/create-user.dto';
import IUser from '@/interfaces/user.interface';
import SignInUserDto from '@/modules/user/dto/sign-in-user.dto';

@Resolver('Auth')
export default class AuthResolver {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => AuthUserResponse, { name: 'createdUser' })
  registerUser(
    @Args('data') user: CreateUserDto,
  ): Observable<AuthUserResponse> {
    return this.authService.create(user).pipe(
      switchMap((result) => {
        return this.authService
          .signInToken({ ...(result as IUser), rememberMe: true })
          .pipe(map((authUser: AuthUserResponse) => authUser));
      }),
    );
  }

  @Query(() => AuthUserResponse, { name: 'loggedUser' })
  signIn(@Args('data') user: SignInUserDto): Observable<AuthUserResponse> {
    return this.authService.login(user).pipe(
      switchMap((result) => {
        return this.authService
          .signInToken({ ...result, rememberMe: user.rememberMe })
          .pipe(map((authUser: AuthUserResponse) => authUser));
      }),
    );
  }
}
