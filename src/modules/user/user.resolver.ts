import { Inject } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { User } from './schema/user.schema';
import UserService from '@modules/user/user.service';

@Resolver('User')
export default class UserResolver {
  constructor(
    @Inject(UserService)
    private readonly usersService: UserService,
  ) {}

  @Query(() => [User], { name: 'user', nullable: false })
  getUser(): object {
    return {
      id: 1,
      firstName: 'AAA',
    };
  }
}
