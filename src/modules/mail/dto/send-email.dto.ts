import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';
import { MESSAGES, VALIDATORS } from '@/common/constants';

@InputType()
export default class SendEmailDto {
  @IsNotEmpty({ message: MESSAGES.VALIDATIONS.EMAIL_IS_REQUIRED })
  @IsEmail()
  @MaxLength(VALIDATORS.EMAIL.max)
  @Matches(VALIDATORS.EMAIL.pattern, { message: MESSAGES.VALIDATIONS.EMAIL_INVALID })
  @Field(() => String)
  readonly email: string;

  @IsNotEmpty()
  @Field(() => String)
  readonly clientOrigin: string;
}
