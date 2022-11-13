import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, catchError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MESSAGES } from '@/common/constants';
import UserService from '@/modules/user/user.service';
import { User } from '@/modules/user/schema/user.schema';

@Injectable()
export class SendgridService {
  constructor(
    private jwtTokenService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    SendGrid.setApiKey(this.configService.get<string>('sendGrid.key'));
  }

  public send({
    email,
    clientOrigin,
  }: {
    email: string;
    clientOrigin: string;
  }): Observable<boolean> {
    return this.userService.doesUserExist({ email }, true).pipe(
      switchMap((user: User) => {
        if (!!user) {
          const resetPasswordToken = this.jwtTokenService.sign(
            {
              sub: user._id,
            },
            { expiresIn: this.configService.get('jwt.expiresInNotRemembered') },
          ) as string;
          return from(
            this.userService.updateUser(user._id, { resetPasswordToken }),
          ).pipe(
            switchMap((_) => {
              const link = `${clientOrigin}?token=${resetPasswordToken}`;
              const mail: SendGrid.MailDataRequired = {
                to: email,
                subject: MESSAGES.SEND_EMAIL.SUBJECT,
                from: this.configService.get('sendGrid.fromEmail'),
                text: MESSAGES.SEND_EMAIL.SUBJECT,
                html: `<div><h3>${MESSAGES.SEND_EMAIL.LINK}</h3><a href="${link}">${link}</a></div>`,
              };
              const source = from(SendGrid.send(mail));
              return source.pipe(
                map((_) => true),
                catchError((_) => {
                  throw new HttpException(
                    MESSAGES.HTTP_EXCEPTION.SENDGRID_FAILURE,
                    HttpStatus.FAILED_DEPENDENCY,
                  );
                }),
              );
            }),
          );
        } else {
          throw new HttpException(
            MESSAGES.USER.USER_DOES_NOT_EXIST,
            HttpStatus.FORBIDDEN,
          );
        }
      }),
      catchError(_ => {
        throw new HttpException(
          MESSAGES.HTTP_EXCEPTION.SMTH_WRONG,
          HttpStatus.FAILED_DEPENDENCY,
        );
      })
    );
  }
}
