import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class Get2faSecretResponse {
  @Field(() => String)
  otpAuthUrl: string;

  constructor(partial?: Partial<Get2faSecretResponse>) {
    Object.assign(this, partial);
  }
}
