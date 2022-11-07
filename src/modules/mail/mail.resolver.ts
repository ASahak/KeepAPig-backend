import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SendgridService } from './mail.service';
import SendEmailDto from '@/modules/mail/dto/send-email.dto';

@Resolver('Mail')
export class MailResolver {
  constructor(
    @Inject(SendgridService)
    private readonly sendgridService: SendgridService,
  ) {}

  @Mutation(() => Boolean, { name: 'sendEmail' })
  sendEmail(@Args('data') data: SendEmailDto): Observable<boolean> {
    return this.sendgridService.send(data);
  }
}
