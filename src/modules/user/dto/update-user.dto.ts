import { IsNotEmpty } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, ID } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@InputType()
class UserInput {
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  fullName?: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false, unique: true })
  email?: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  avatar?: string;

  @Field(() => Boolean, { nullable: true })
  @Prop({ required: false })
  isEnabledTwoFactorAuth?: boolean;

  @Field(() => Boolean, { nullable: true })
  @Prop({ required: false })
  isVerifiedTwoFactorAuth?: boolean;
}

@InputType()
export default class UpdateUserDto {
  @IsNotEmpty()
  @Field(() => ID)
  readonly _id: MongooseSchema.Types.ObjectId | string;

  @IsNotEmpty()
  @Field(() => UserInput)
  readonly payload: Partial<{ [key in keyof UserInput]: UserInput[key] }>;
}
