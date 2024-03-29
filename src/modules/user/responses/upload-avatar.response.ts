import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class UploadAvatarResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  avatarSrc: string;

  constructor(partial?: Partial<UploadAvatarResponse>) {
    Object.assign(this, partial);
  }
}
