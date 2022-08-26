import { Schema as MongooseSchema } from 'mongoose';
import { USER_ROLES } from '@common/enums';

export default interface IUser {
  _id: MongooseSchema.Types.ObjectId | string;
  email: string;
  fullName: string;
  password: string;
  role: keyof typeof USER_ROLES;
  google?: GoogleIUser;
}

export interface GoogleIUser {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
}

export interface UserJwtPayload {
  name: string;
  sub: MongooseSchema.Types.ObjectId | string;
}
