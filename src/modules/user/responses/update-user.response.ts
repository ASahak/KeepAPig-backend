import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class UpdateUserResponse {
  @Field(() => Boolean)
  success: boolean;

  constructor(partial?: Partial<UpdateUserResponse>) {
    Object.assign(this, partial);
  }
}
