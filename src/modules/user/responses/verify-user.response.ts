import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/modules/user/schema/user.schema';
import IUser from '@/interfaces/user.interface';

@ObjectType()
export default class VerifyUserResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => User, { nullable: true })
  user?: Partial<IUser>;

  constructor(partial?: Partial<VerifyUserResponse>) {
    Object.assign(this, partial);
  }
}
