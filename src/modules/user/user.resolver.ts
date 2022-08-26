import { Inject } from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { User } from './schema/user.schema';
import UserService from '@modules/user/user.service';
import FetchUserResponse from '@modules/auth/responses/fetch-user.response';
import FetchUserInputType from '@modules/user/dto/inputs/fetch-user-input-type';

@Resolver('User')
export default class UserResolver {
  constructor(
    @Inject(UserService)
    private readonly usersService: UserService,
  ) {}

  @Query(() => FetchUserResponse, { name: 'fetchedUser', nullable: false })
  fetchUser(
    @Args('data') user: FetchUserInputType,
  ): Observable<FetchUserResponse> {
    return this.usersService.fetchUser(user).pipe(
      switchMap(async (result) => ({ user: result })),
    );
  }
}
