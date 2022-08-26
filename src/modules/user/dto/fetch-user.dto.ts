import { IsNotEmpty } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export default class FetchUserDto {
  @IsNotEmpty()
  @Field(() => String)
  readonly _id: string | MongooseSchema.Types.ObjectId;
}
