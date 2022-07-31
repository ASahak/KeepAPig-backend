import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { USER_ROLES } from '@common/enums';
import { PASSWORD_SALT_ROUNDS } from '@common/constants';
import { GoogleIUser } from '@interfaces/user.interface';

@ObjectType()
class BasicUserModel extends Document {
  @Field(() => String)
  @Prop({ required: true })
  fullName: string;

  @Field(() => String)
  @Prop({ required: true, unique: true })
  email: string;
}

@ObjectType()
class GoogleModel extends BasicUserModel {
  @Field(() => String)
  @Prop({ required: true })
  id: string;

  @Field(() => String)
  @Prop({ required: true })
  avatar: string;
}

@ObjectType()
@Schema({
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User extends BasicUserModel {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ required: true })
  password: string;

  @Field(() => GoogleModel)
  @Prop({ type: Object })
  google: GoogleIUser;

  @Field(() => String)
  @Prop({
    default: USER_ROLES.USER,
    enum: USER_ROLES,
    required: true,
    type: String,
  })
  role: keyof typeof USER_ROLES;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  const self = this;

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(PASSWORD_SALT_ROUNDS, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(self.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          self.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});
