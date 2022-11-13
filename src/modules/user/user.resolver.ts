import { Inject } from '@nestjs/common';
import { Observable, switchMap, from, of } from 'rxjs';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import IUser from '@/interfaces/user.interface';
import UserService from '@/modules/user/user.service';
import FetchUserResponse from '@/modules/user/responses/fetch-user.response';
import ChangePasswordResponse from '@/modules/user/responses/change-password.response';
import FetchUserDto from '@/modules/user/dto/fetch-user.dto';
import ChangePasswordDto from '@/modules/user/dto/change-password.dto';

@Resolver('User')
export default class UserResolver {
  constructor(
    @Inject(UserService)
    private readonly usersService: UserService,
  ) {}

  @Mutation(() => ChangePasswordResponse, { name: 'changePassword' })
  changePassword(
    @Args('data') data: ChangePasswordDto,
  ): Observable<{ success: boolean }> {
    return from(this.usersService.changePassword(data)).pipe(
      switchMap((success: boolean) => of({ success })),
    );
  }

  @Query(() => FetchUserResponse, { name: 'fetchedUser', nullable: false })
  fetchUser(@Args('data') user: FetchUserDto): Observable<FetchUserResponse> {
    return this.usersService
      .fetchUser(user)
      .pipe(switchMap(async (result: IUser) => ({ user: result })));
  }
}
