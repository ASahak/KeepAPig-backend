import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@modules/users/schema/user.schema';

@ObjectType()
export default class CreatedUserResponse {
    @Field((_type) => User)
    user: User;

    @Field()
    token: string;

    constructor(partial?: Partial<CreatedUserResponse>) {
        Object.assign(this, partial);
    }
}
