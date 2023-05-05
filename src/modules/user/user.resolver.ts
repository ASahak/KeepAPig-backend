import { Inject } from '@nestjs/common';
import { Observable, switchMap, of } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import IUser from '@/interfaces/user.interface';
import UserService from '@/modules/user/user.service';
import FetchUserResponse from '@/modules/user/responses/fetch-user.response';
import ChangePasswordResponse from '@/modules/user/responses/change-password.response';
import UploadAvatarResponse from '@/modules/user/responses/upload-avatar.response';
import FetchUserDto from '@/modules/user/dto/fetch-user.dto';
import ChangePasswordDto from '@/modules/user/dto/change-password.dto';
import UploadAvatarDto from '@/modules/user/dto/upload-avatar.dto';

@Resolver('User')
export default class UserResolver {
  constructor(
    @Inject(UserService)
    private readonly usersService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  @Mutation(() => ChangePasswordResponse, { name: 'changePassword' })
  changePassword(
    @Args('data') data: ChangePasswordDto,
  ): Observable<{ success: boolean }> {
    return this.usersService
      .changePassword(data)
      .pipe(switchMap((success: boolean) => of({ success })));
  }

  @Query(() => FetchUserResponse, { name: 'fetchedUser', nullable: false })
  fetchUser(@Args('data') user: FetchUserDto): Observable<FetchUserResponse> {
    return this.usersService
      .fetchUser(user)
      .pipe(switchMap((result: IUser) => of({ user: result })));
  }

  @Mutation(() => UploadAvatarResponse, { name: 'uploadedAvatar' })
  uploadAvatar(
    @Args('data') { file }: UploadAvatarDto,
    @Context() context: any,
  ): Observable<UploadAvatarResponse> {
    const { req } = context;
    const token = req.headers.authorization.split(' ')[1];
    const { sub } = this.jwtTokenService.decode(token);
    return this.usersService
      .uploadPicture(file, sub)
      .pipe(switchMap((success: boolean) => of({ success, avatarSrc: '' })));
  }
}
