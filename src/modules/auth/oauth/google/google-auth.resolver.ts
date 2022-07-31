import { Inject } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Observable, switchMap, map } from 'rxjs';
import AuthService from '@modules/auth/auth.service';
import AuthUserResponse from '@modules/auth/responses/auth-user.response';
import { GoogleUserInput } from '@modules/users/dto/inputs/create-user-input-type';
import IUser from '@interfaces/user.interface';

@Resolver('GoogleAuth')
export default class GoogleAuthResolver {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {
  }

  @Mutation(() => AuthUserResponse, { name: 'googleCreatedUser' })
  registerUser(
    @Args('data') user: GoogleUserInput,
  ): Observable<AuthUserResponse> {
    return this.authService.createGoogleUser(user).pipe(
      switchMap((result) => {
        return this.authService
          .signInToken(result as IUser)
          .pipe(map((authUser: AuthUserResponse) => authUser));
      }),
    );
  }
}
