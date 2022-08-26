import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@modules/user/schema/user.schema';
import IUser from '@interfaces/user.interface';

@ObjectType()
export default class FetchUserResponse {
  @Field(() => User)
  user: Partial<IUser>;

  constructor(partial?: Partial<FetchUserResponse>) {
    Object.assign(this, partial);
  }
}
