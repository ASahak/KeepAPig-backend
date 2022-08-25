import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export default class SignInUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'The min length of password is 8' })
  @Field(() => String)
  readonly password: string;

  @IsNotEmpty()
  @Field(() => Boolean)
  readonly rememberMe: boolean;
}
