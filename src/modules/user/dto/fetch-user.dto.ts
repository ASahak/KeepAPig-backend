import { IsNotEmpty } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export default class FetchUserDto {
  @IsNotEmpty()
  @Field(() => String)
  readonly _id: string | MongooseSchema.Types.ObjectId;
}
