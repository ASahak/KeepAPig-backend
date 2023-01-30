import { Inject, UseInterceptors } from '@nestjs/common';
import { Observable, switchMap, from, of } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import multer from 'multer';
import { extname } from 'path';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { FileInterceptor } from '@nestjs/platform-express';
import IUser from '@/interfaces/user.interface';
import UserService from '@/modules/user/user.service';
import FetchUserResponse from '@/modules/user/responses/fetch-user.response';
import ChangePasswordResponse from '@/modules/user/responses/change-password.response';
import UploadAvatarResponse from '@/modules/user/responses/upload-avatar.response';
import FetchUserDto from '@/modules/user/dto/fetch-user.dto';
import ChangePasswordDto from '@/modules/user/dto/change-password.dto';
import UploadAvatarDto from '@/modules/user/dto/upload-avatar.dto';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

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

  @Mutation(() => UploadAvatarResponse, { name: 'uploadedAvatar' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadAvatar(
    @Args('data') data: UploadAvatarDto,
    @Context() context: any,
  ) {
    // const { req } = context;
    // const token = req.headers.authorization.split(' ')[1];
    // const { sub } = this.jwtTokenService.decode(token);
    // return this.usersService.uploadPicture(data.file, sub);
  }
}
