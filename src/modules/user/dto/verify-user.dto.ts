import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export default class VerifyUserDto {
  @IsNotEmpty()
  @Field(() => String)
  readonly email: string;

  @IsNotEmpty()
  @Field(() => String)
  readonly code: string;

  @Field(() => Boolean, { nullable: true })
  readonly returnUser?: boolean;
}
