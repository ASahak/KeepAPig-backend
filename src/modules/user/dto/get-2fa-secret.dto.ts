import { IsNotEmpty } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export default class Get2faSecretDto {
  @IsNotEmpty()
  @Field(() => ID)
  readonly _id: MongooseSchema.Types.ObjectId | string;
}
