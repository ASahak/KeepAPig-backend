import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@modules/users/schema/user.schema';
import { UserPayloadTypes } from "@interfaces/user.interface";

@ObjectType()
export default class AuthUserResponse {
    @Field((_type) => User)
    user: Partial<UserPayloadTypes>;

    @Field()
    token: string;

    constructor(partial?: Partial<AuthUserResponse>) {
        Object.assign(this, partial);
    }
}
