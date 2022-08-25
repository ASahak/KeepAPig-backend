import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export default class UserArgs {
  @Field()
  readonly email: string;

  @Field()
  readonly fullName: string;

  @Field()
  readonly password: string;
}
