import { Document, Schema as MongooseSchema } from 'mongoose';

export default interface IUser extends Document {
    _id: MongooseSchema.Types.ObjectId;
    email: string;
    fullName: string;
    password: string;
    role: string;
}

export interface UserJwtPayload {
    name: string;
    sub: MongooseSchema.Types.ObjectId;
}
