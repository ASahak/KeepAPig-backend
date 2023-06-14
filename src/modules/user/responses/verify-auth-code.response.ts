import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class VerifyAuthCodeResponse {
  @Field(() => Boolean)
  success: boolean;

  constructor(partial?: Partial<VerifyAuthCodeResponse>) {
    Object.assign(this, partial);
  }
}
