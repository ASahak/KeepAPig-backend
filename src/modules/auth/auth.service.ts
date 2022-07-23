import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, from, of, map } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import CreateUserDto, { CreateGoogleUserDto } from '@modules/users/dto/create-user.dto';
import { User, UserDocument } from '@modules/users/schema/user.schema';
import IUser, { UserPayloadTypes, UserJwtPayload,GoogleIUser } from '@interfaces//user.interface';
import AuthUserResponse from './responses/auth-user.response';

@Injectable()
export default class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private jwtTokenService: JwtService
    ) {
    }

    public createGoogleUser(
        createGoogleCustomerDto: CreateGoogleUserDto,
    ): Observable<Partial<GoogleIUser>> {
        return this.doesUserExist(createGoogleCustomerDto.email).pipe(
            switchMap( async (doesUserExist: boolean) => {
                if (doesUserExist) {
                    throw new HttpException(
                        'A user has already been created with this email address',
                        HttpStatus.FORBIDDEN,
                    );
                }
                const { _id, avatar, email, fullName, role } = createGoogleCustomerDto;
                return await new this.userModel({
                    _id, avatar, email, fullName, role
                }).save();
            })
        )
    }

    public create(
        createCustomerDto: CreateUserDto,
    ): Observable<IUser> {
        return this.doesUserExist(createCustomerDto.email).pipe(
            switchMap( async (doesUserExist: boolean) => {
                if (doesUserExist) {
                    throw new HttpException(
                        'A user has already been created with this email address',
                        HttpStatus.FORBIDDEN,
                    );
                }
                return await new this.userModel(createCustomerDto).save();
            })
        )
    }

    public signInToken = (user: Partial<UserPayloadTypes>): Observable<AuthUserResponse> => {
        const payload: UserJwtPayload = { name: user.fullName, sub: user._id };
        return of(new AuthUserResponse({
            user,
            token: this.jwtTokenService.sign(payload),
        }));
    }

    private doesUserExist(email: string): Observable<boolean> {
        return from(this.userModel.findOne({ email })).pipe(
            map((user: User) => {
                return !!user;
            }),
        );
    }

    async loginWithCredentials(user: IUser) {
        const payload = { email: user.email, sub: user._id };

        return {
            access_token: this.jwtTokenService.sign(payload),
        };
    }
}
