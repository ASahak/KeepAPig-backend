import { Schema as MongooseSchema } from 'mongoose';
import { USER_ROLES } from '@common/enums';

export default interface IUser {
  _id: MongooseSchema.Types.ObjectId | string;
  email: string;
  fullName: string;
  password: string;
  role: keyof typeof USER_ROLES;
}

export interface GoogleIUser {
  _id: MongooseSchema.Types.ObjectId | string;
  email: string;
  fullName: string;
  avatar: string;
  token: string;
  role: keyof typeof USER_ROLES;
}

export type UserPayloadTypes = GoogleIUser & IUser;

export interface UserJwtPayload {
  name: string;
  sub: MongooseSchema.Types.ObjectId | string;
}
