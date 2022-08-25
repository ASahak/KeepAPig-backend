import { InputType, Field } from '@nestjs/graphql';

@InputType()
export default class SignInUserInputType {
  @Field(() => String)
  readonly email: string;

  @Field(() => String)
  readonly password: string;

  @Field(() => Boolean)
  readonly rememberMe: boolean;
}
