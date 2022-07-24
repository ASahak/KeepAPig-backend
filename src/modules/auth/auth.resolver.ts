import { Inject, UseGuards, Request } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Observable, switchMap, map } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import AuthService from '@modules/auth/auth.service';
import AuthUserResponse from '@modules/auth/responses/auth-user.response';
import CreateUserInput from '@modules/users/dto/inputs/create-user-input-type';
import { User } from '@modules/users/schema/user.schema';
import IUser from '@interfaces/user.interface';

@Resolver('Auth')
export default class AuthResolver {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => AuthUserResponse, { name: 'createdUser' })
  registerUser(
    @Args('data') user: CreateUserInput,
  ): Observable<AuthUserResponse> {
    return this.authService.create(user).pipe(
      switchMap((result) => {
        return this.authService
          .signInToken(result as IUser)
          .pipe(map((authUser: AuthUserResponse) => authUser));
      }),
    );
  }

  @UseGuards(AuthGuard('local'))
  @Mutation(() => User)
  async login(@Request() req) {
    // todo
    return this.authService.loginWithCredentials(req.user);
  }
}
