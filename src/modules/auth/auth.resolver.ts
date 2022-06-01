import { Inject, UseGuards, Request } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import AuthService from '@modules/auth/auth.service';
import CreatedUserResponse from './responses/created-user.response';
import CreateUserInput from '@modules/users/dto/inputs/create-user-input-type';
import { User } from '@modules/users/schema/user.schema';

@Resolver('Auth')
export default class AuthResolver {

    constructor(
        @Inject(AuthService)
        private readonly authService: AuthService,
        ) {
    }

    @Mutation((_returns) => CreatedUserResponse, { name: 'createdUser' })
    registerUser(
        @Args('data') user: CreateUserInput
    ): Observable<CreatedUserResponse> {
        return this.authService.create(user);
    }

    @UseGuards(AuthGuard('local'))
    @Mutation(() => User)
    async login(@Request() req) { // todo
        return this.authService.loginWithCredentials(req.user);
    }
}
