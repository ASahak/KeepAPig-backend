import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { MESSAGES, VALIDATORS } from '@/common/constants';

@InputType()
export default class SignInUserDto {
  @IsNotEmpty({ message: MESSAGES.VALIDATIONS.EMAIL_IS_REQUIRED })
  @IsEmail()
  @MaxLength(VALIDATORS.EMAIL.max)
  @Matches(VALIDATORS.EMAIL.pattern, {
    message: MESSAGES.VALIDATIONS.EMAIL_INVALID,
  })
  @Field(() => String)
  readonly email: string;

  @IsNotEmpty({ message: MESSAGES.VALIDATIONS.PASSWORD_IS_NOT_BE_EMPTY })
  @MinLength(VALIDATORS.PASSWORD.min, {
    message: MESSAGES.VALIDATIONS.PASSWORD_HAS_MIN,
  })
  @MaxLength(VALIDATORS.PASSWORD.max, {
    message: MESSAGES.VALIDATIONS.PASSWORD_HAS_MAX,
  })
  @Matches(VALIDATORS.PASSWORD.passwordAZ, {
    message: MESSAGES.VALIDATIONS.PASSWORD_ONLY_LATIN_CHARACTERS,
  })
  @Matches(VALIDATORS.PASSWORD.symbolPattern, {
    message: MESSAGES.VALIDATIONS.PASSWORD_SYMBOL_REQUIRED,
  })
  @Matches(VALIDATORS.PASSWORD.digitPattern, {
    message: MESSAGES.VALIDATIONS.PASSWORD_DIGIT_REQUIRED,
  })
  @Matches(VALIDATORS.PASSWORD.upperCaseLowerCasePattern, {
    message: MESSAGES.VALIDATIONS.PASSWORD_LOWERCASE_UPPERCASE_REQUIRED,
  })
  @Field(() => String)
  readonly password: string;

  @IsNotEmpty()
  @Field(() => Boolean)
  readonly rememberMe: boolean;
}
