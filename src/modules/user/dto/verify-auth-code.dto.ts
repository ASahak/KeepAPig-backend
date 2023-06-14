import { IsNotEmpty } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export default class VerifyAuthCodeDto {
  @IsNotEmpty()
  @Field(() => ID)
  readonly _id: MongooseSchema.Types.ObjectId | string;

  @IsNotEmpty()
  @Field(() => String)
  readonly code: string;
}
