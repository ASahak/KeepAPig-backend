import { InputType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export default class ChangePasswordInputType {
  @Field(() => String)
  readonly password: string;

  @Field(() => String)
  readonly token: string;

  @Field(() => String)
  readonly _id: MongooseSchema.Types.ObjectId | string;
}
