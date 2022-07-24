import { Inject } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { User } from './schema/user.schema';
import UsersService from '@modules/users/users.service';

@Resolver('User')
export default class UsersResolver {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [User], { name: 'user', nullable: false })
  getUser(): object {
    return {
      id: 1,
      firstName: 'AAA',
    };
  }
}
