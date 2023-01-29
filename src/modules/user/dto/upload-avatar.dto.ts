import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@InputType()
export default class UploadAvatarDto {
  @IsNotEmpty()
  @Field(() => GraphQLUpload)
  readonly file: FileUpload;
}
