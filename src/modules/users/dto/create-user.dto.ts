import { IsEmail, IsNotEmpty, MinLength, IsString, Matches } from 'class-validator';
import { ObjectType, Field } from '@nestjs/graphql';
import { USER_ROLES } from "@common/enums";

@ObjectType()
export default class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    @Field()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    readonly fullName: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'The min length of password is 8' })
    @Field()
    readonly password: string;

    @IsNotEmpty()
    @Matches(`^${Object.values(USER_ROLES).filter(v => typeof v !== 'number').join('|')}$`, 'i')
    @Field()
    readonly role: USER_ROLES;
}
