import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  Matches,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { USER_ROLES } from '@/common/enums';
import { VALIDATORS, MESSAGES } from '@/common/constants';

@InputType()
export default class CreateUserDto {
  @IsNotEmpty({ message: MESSAGES.VALIDATIONS.EMAIL_IS_REQUIRED })
  @IsEmail()
  @MaxLength(VALIDATORS.EMAIL.max)
  @Matches(VALIDATORS.EMAIL.pattern, {
    message: MESSAGES.VALIDATIONS.EMAIL_INVALID,
  })
  @Field(() => String)
  readonly email: string;

  @IsNotEmpty({ message: MESSAGES.VALIDATIONS.FULL_NAME_IS_REQUIRED })
  @IsString()
  @MinLength(VALIDATORS.NAME.min, {
    message: MESSAGES.VALIDATIONS.FULL_NAME_MIN,
  })
  @MaxLength(VALIDATORS.NAME.max, {
    message: MESSAGES.VALIDATIONS.FULL_NAME_MAX,
  })
  @Matches(VALIDATORS.NAME.pattern, {
    message: MESSAGES.VALIDATIONS.FULL_NAME_PATTERN,
  })
  @Matches(VALIDATORS.NAME.onlyLatinPattern, {
    message: MESSAGES.VALIDATIONS.FULL_NAME_ONLY_LATIN_PATTERN,
  })
  @Field(() => String)
  readonly fullName: string;

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
  @Matches(
    `^${Object.values(USER_ROLES)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  @Field(() => String)
  readonly role: keyof typeof USER_ROLES;
}

@InputType()
export class CreateGoogleUserDto {
  @IsNotEmpty()
  @Field(() => String)
  readonly id: string;

  @IsNotEmpty({ message: MESSAGES.VALIDATIONS.EMAIL_IS_REQUIRED })
  @IsEmail()
  @MaxLength(VALIDATORS.EMAIL.max)
  @Matches(VALIDATORS.EMAIL.pattern, {
    message: MESSAGES.VALIDATIONS.EMAIL_INVALID,
  })
  @Field(() => String)
  readonly email: string;

  @IsNotEmpty({ message: MESSAGES.VALIDATIONS.FULL_NAME_IS_REQUIRED })
  @IsString()
  @Field(() => String)
  readonly fullName: string;

  @IsNotEmpty()
  @Field(() => String)
  readonly avatar: string;

  @IsNotEmpty()
  @Matches(
    `^${Object.values(USER_ROLES)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  @Field(() => String)
  readonly role: keyof typeof USER_ROLES;
}
