import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class DeleteAvatarResponse {
  @Field(() => Boolean)
  success: boolean;

  constructor(partial?: Partial<DeleteAvatarResponse>) {
    Object.assign(this, partial);
  }
}
