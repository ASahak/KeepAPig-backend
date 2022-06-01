import { InputType, Field } from '@nestjs/graphql';
import { USER_ROLES } from '@common/enums';

@InputType()
export default class UserInput {
    @Field()
    readonly email: string;

    @Field()
    readonly fullName: string;

    @Field()
    readonly password: string;

    @Field()
    readonly role: USER_ROLES;
}
