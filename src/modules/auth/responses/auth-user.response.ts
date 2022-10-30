import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/modules/user/schema/user.schema';
import IUser from '@/interfaces/user.interface';

@ObjectType()
export default class AuthUserResponse {
  @Field(() => User)
  user: Partial<IUser>;

  @Field()
  token: string;

  constructor(partial?: Partial<AuthUserResponse>) {
    Object.assign(this, partial);
  }
}
