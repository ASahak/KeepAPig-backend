import { Inject, UseInterceptors } from '@nestjs/common';
import { Observable, switchMap, from, of } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Resolver, Query, Args, Mutation, Int, Context } from '@nestjs/graphql';
import { FileInterceptor } from '@nestjs/platform-express';
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
  async uploadAvatar(
    @Args('data') data: UploadAvatarDto,
    @Context() context: any
  ) {
    const { req } = context;
    const token = req.headers.authorization.split(' ')[1];
    const { sub } = this.jwtTokenService.decode(token);
    return this.usersService
      .uploadPicture(data.file, sub);
    // try {
      // const { createReadStream } = file;
      //
      // const stream = createReadStream();

      // const storage = diskStorage({
      //   destination: '@/storage/uploads',
      //   filename: (req, file, cb) => {
      //     const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
      //     return cb(null, `${randomName}${file.originalname}`)
      //   },
      // });
      //
      // storage(stream)
      // return

      // const chunks = [];
      //
      // const buffer = await new Promise<Buffer>((resolve, reject) => {
      //   let buffer: Buffer;
      //
      //   stream.on('data', function (chunk) {
      //     chunks.push(chunk);
      //   });
      //
      //   stream.on('end', function () {
      //     buffer = Buffer.concat(chunks);
      //       resolve(buffer);
      //   });
      //
      //   stream.on('error', reject);
      // });1

      // const base64 = buffer.toString('base64');
      // If you want to store the file, this is one way of doing
      // it, as you have the file in-memory as Buffer
      // await fs.writeFile('upload.jpg', buffer);
      // this.person.coverPhotoLength = base64.length;
      // this.person.coverPhoto = base64;
      //
      // return base64.length;
    // } catch (err) {
    //   return 0;
    // }
  }

  // @Mutation(() => Boolean)
  // async uploadAvatar(
  //   @Args('avatar') file: any
  // ): Promise<boolean> {
  //   const { createReadStream, filename } = await file;
  //   const stream = createReadStream();
  //
  //   // Use the diskStorage function from multer to handle file storage
  //   // const storage = diskStorage({
  //   //   destination: '@/storage/uploads',
  //   //   filename: (req, file, cb) => {
  //   //     const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
  //   //     return cb(null, `${randomName}${extname(file.originalname)}`)
  //   //   },
  //   // });
  //   //
  //   // storage(stream)
  //
  //   return true;
  // }
}
