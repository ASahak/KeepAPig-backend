import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class ChangePasswordResponse {
  @Field(() => Boolean)
  success: boolean;

  constructor(partial?: Partial<ChangePasswordResponse>) {
    Object.assign(this, partial);
  }
}
