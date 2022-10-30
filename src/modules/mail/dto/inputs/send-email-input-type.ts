import { InputType, Field } from '@nestjs/graphql';

@InputType()
export default class SendEmailInputType {
  @Field(() => String)
  readonly email: string;

  @Field(() => String)
  readonly clientOrigin: string;
}
