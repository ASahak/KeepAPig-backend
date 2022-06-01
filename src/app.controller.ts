import { Controller,Get, Request, Post, UseGuards } from '@nestjs/common';
// import { LocalAuthGuard } from '@modules/auth/guards/local-auth.guard';
// import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
// import { AuthService } from '@modules/auth/auth.service';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
      // private authService: AuthService,
      private readonly appService: AppService
  ) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }
  //
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
  //
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
