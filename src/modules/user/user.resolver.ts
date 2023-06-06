import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Observable, switchMap, of } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import IUser from '@/interfaces/user.interface';
import UserService from '@/modules/user/user.service';
import FetchUserResponse from '@/modules/user/responses/fetch-user.response';
import ChangePasswordResponse from '@/modules/user/responses/change-password.response';
import UploadAvatarResponse from '@/modules/user/responses/upload-avatar.response';
import DeleteAvatarResponse from '@/modules/user/responses/delete-avatar.response';
import FetchUserDto from '@/modules/user/dto/fetch-user.dto';
import ChangePasswordDto from '@/modules/user/dto/change-password.dto';
import UploadAvatarDto from '@/modules/user/dto/upload-avatar.dto';
import UpdateUserResponse from '@/modules/user/responses/update-user.response';
import UpdateUserDto from '@/modules/user/dto/update-user.dto';
import { User } from '@/modules/user/schema/user.schema';
import { MESSAGES } from '@/common/constants';

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
    return this.usersService.uploadPicture(file, sub).pipe(
      switchMap(({ success, secure_url }) => {
        return this.usersService.updateUser(sub, { avatar: secure_url }).pipe(
          switchMap((_) => {
            return of({ success, avatarSrc: secure_url });
          }),
        );
      }),
    );
  }

  @Mutation(() => UpdateUserResponse, { name: 'updateUser' })
  updateUser(
    @Args('data') data: UpdateUserDto,
  ): Observable<UpdateUserResponse> {
    return this.usersService.doesUserExist({ _id: data._id }).pipe(
      switchMap((exist: boolean) => {
        if (exist) {
          return this.usersService
            .updateUser(data._id, { ...data.payload })
            .pipe(
              switchMap((_) => {
                return of({ success: true });
              }),
            );
        } else {
          throw new HttpException(MESSAGES.USER.NO_USER, HttpStatus.FORBIDDEN);
        }
      }),
    );
  }

  @Mutation(() => DeleteAvatarResponse, { name: 'deleteAvatar' })
  deleteAvatar(@Context() context: any): Observable<DeleteAvatarResponse> {
    const { req } = context;
    const token = req.headers.authorization.split(' ')[1];
    const { sub } = this.jwtTokenService.decode(token);
    return this.usersService
      .deletePicture(sub)
      .pipe(switchMap((res: boolean) => of({ success: res })));
  }
}
