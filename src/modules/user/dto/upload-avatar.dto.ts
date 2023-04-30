import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from '@/interfaces/global.interface';

@InputType()
export default class UploadAvatarDto {
  @IsNotEmpty()
  @Field(() => GraphQLUpload)
  readonly file: FileUpload;
}
