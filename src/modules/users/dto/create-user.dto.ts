import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  Matches,
} from 'class-validator';
import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { USER_ROLES } from '@common/enums';

@ObjectType()
export default class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  readonly fullName: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'The min length of password is 8' })
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

@ObjectType()
export class CreateGoogleUserDto {
  @IsNotEmpty()
  @Field()
  readonly _id: MongooseSchema.Types.ObjectId | string;

  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  readonly email: string;

  @IsNotEmpty()
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
