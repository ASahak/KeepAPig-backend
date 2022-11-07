import { IsNotEmpty, MinLength, Matches, MaxLength } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, ID } from '@nestjs/graphql';
import { MESSAGES, VALIDATORS } from '@/common/constants';

@InputType()
export default class ChangePasswordDto {
  @IsNotEmpty()
  @Field(() => ID)
  readonly _id: MongooseSchema.Types.ObjectId | string;

  @IsNotEmpty({ message: MESSAGES.VALIDATIONS.PASSWORD_IS_NOT_BE_EMPTY })
  @MinLength(VALIDATORS.PASSWORD.min, { message: MESSAGES.VALIDATIONS.PASSWORD_HAS_MIN })
  @MaxLength(VALIDATORS.PASSWORD.max, { message: MESSAGES.VALIDATIONS.PASSWORD_HAS_MAX })
  @Matches(VALIDATORS.PASSWORD.passwordAZ, { message: MESSAGES.VALIDATIONS.PASSWORD_ONLY_LATIN_CHARACTERS })
  @Matches(VALIDATORS.PASSWORD.symbolPattern, { message: MESSAGES.VALIDATIONS.PASSWORD_SYMBOL_REQUIRED })
  @Matches(VALIDATORS.PASSWORD.digitPattern, { message: MESSAGES.VALIDATIONS.PASSWORD_DIGIT_REQUIRED })
  @Matches(VALIDATORS.PASSWORD.upperCaseLowerCasePattern, { message: MESSAGES.VALIDATIONS.PASSWORD_LOWERCASE_UPPERCASE_REQUIRED })
  @Field(() => String)
  readonly password: string;

  @IsNotEmpty({ message: MESSAGES.VALIDATIONS.TOKEN_IS_NOT_BE_EMPTY })
  @Field(() => String)
  readonly token: string;
}
