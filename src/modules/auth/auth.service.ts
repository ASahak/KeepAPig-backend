import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import CreateUserDto from '@modules/users/dto/create-user.dto';
import { User, UserDocument } from '@modules/users/schema/user.schema';
import IUser, { UserJwtPayload } from '@interfaces//user.interface';
import CreatedUserResponse from './responses/created-user.response';

@Injectable()
export default class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private jwtTokenService: JwtService
    ) {
    }

    public create(
        createCustomerDto: CreateUserDto,
    ): Observable<CreatedUserResponse> {
        return this.doesUserExist(createCustomerDto.email).pipe(
            tap((doesUserExist: boolean) => {
                if (doesUserExist) {
                    throw new HttpException(
                        'A user has already been created with this email address',
                        HttpStatus.FORBIDDEN,
                    );
                }
            }),
            switchMap(async () => {
                const newCustomer = new this.userModel(createCustomerDto);
                await newCustomer.save();
                const token = this.signInToken(newCustomer);
                return { user: newCustomer, token }
            })
        )
    }

    private signInToken = (user: IUser) => {
        const payload: UserJwtPayload = { name: user.fullName, sub: user._id };

        return this.jwtTokenService.sign(payload);
    }

    private doesUserExist(email: string): Observable<boolean> {
        return from(this.userModel.findOne({ email })).pipe(
            switchMap((user: User) => {
                return of(!!user);
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
