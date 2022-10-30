import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { SendgridService } from './mail.service';
import SendEmailInputType from '@/modules/mail/dto/inputs/send-email-input-type';

@Resolver('Mail')
export class MailResolver {
  constructor(
    @Inject(SendgridService)
    private readonly sendgridService: SendgridService,
  ){}

  @Mutation(() => Boolean, { name: 'sendEmail' })
  sendEmail(
    @Args('data') data: SendEmailInputType,
  ): Observable<boolean> {
    return this.sendgridService.send(data);
  }
}
