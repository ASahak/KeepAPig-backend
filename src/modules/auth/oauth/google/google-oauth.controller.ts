import { Get, Req, Res, UseGuards, Controller } from '@nestjs/common';
import { Request, Response } from 'express';
import { map } from 'rxjs';
import AuthService from '@modules/auth/auth.service';
import { GoogleOauthGuard } from '@modules/auth/guards/google-oauth.guard';
import AuthUserResponse from '@modules/auth/responses/auth-user.response';
import { GoogleIUser } from '@interfaces/user.interface';
import { switchMap } from 'rxjs/operators';

@Controller('auth/google')
export default class GoogleOauthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      // res.send()
    }
    this.authService
      .createGoogleUser(req.user as GoogleIUser)
      .pipe(
        switchMap((result) => {
          return this.authService
            .signInToken(result)
            .pipe(map((authUser: AuthUserResponse) => authUser));
        }),
      )
      .subscribe((r) => {
        res.cookie('token', r, { expires: new Date() });
        res.redirect('http://localhost:3000/');
      });
  }
}
