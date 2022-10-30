import { Inject } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Observable, switchMap, map } from 'rxjs';
import AuthService from '@/modules/auth/auth.service';
import AuthUserResponse from '@/modules/auth/responses/auth-user.response';
import CreateUserInputType from '@/modules/user/dto/inputs/create-user-input-type';
import IUser from '@/interfaces/user.interface';
import SignInUserInputType from '@/modules/user/dto/inputs/sign-in-user-input-type';

@Resolver('Auth')
export default class AuthResolver {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => AuthUserResponse, { name: 'createdUser' })
  registerUser(
    @Args('data') user: CreateUserInputType,
  ): Observable<AuthUserResponse> {
    return this.authService.create(user).pipe(
      switchMap((result) => {
        return this.authService
          .signInToken(result as IUser)
          .pipe(map((authUser: AuthUserResponse) => authUser));
      }),
    );
  }

  @Query(() => AuthUserResponse, { name: 'loggedUser' })
  signIn(
    @Args('data') user: SignInUserInputType,
  ): Observable<AuthUserResponse> {
    return this.authService.login(user).pipe(
      switchMap((result) => {
        return this.authService
          .signInToken(result as IUser)
          .pipe(map((authUser: AuthUserResponse) => authUser));
      }),
    );
  }
}
