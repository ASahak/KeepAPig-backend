import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/modules/user/schema/user.schema';
import IUser from '@/interfaces/user.interface';

@ObjectType()
export class AuthUserResponse {
  @Field(() => User, { nullable: true })
  user?: Partial<IUser>;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  notVerified?: boolean;

  constructor(partial?: Partial<AuthUserResponse>) {
    Object.assign(this, partial);
  }
}
