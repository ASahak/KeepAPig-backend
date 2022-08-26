import { InputType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export default class FetchUserInputType {
  @Field(() => String)
  readonly _id: string | MongooseSchema.Types.ObjectId;
}
