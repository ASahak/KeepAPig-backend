import { InputType, Field } from '@nestjs/graphql';
import { USER_ROLES } from '@common/enums';

@InputType()
export default class UserInput {
  @Field(() => String)
  readonly email: string;

  @Field(() => String)
  readonly fullName: string;

  @Field(() => String)
  readonly password: string;

  @Field(() => String)
  readonly role: keyof typeof USER_ROLES;
}
