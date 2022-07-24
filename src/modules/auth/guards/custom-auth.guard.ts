import {
  CanActivate,
  ExecutionContext,
  mixin,
  Optional,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { defaultOptions } from '@nestjs/passport/dist/options';
import { AuthModuleOptions, IAuthGuard } from '@nestjs/passport';
import { memoize } from '@nestjs/passport/dist/utils/memoize.util';
import * as passport from 'passport';

export const CustomAuthGuard: (type?: string | string[]) => Type<IAuthGuard> =
  memoize(createAuthGuard);

function createAuthGuard(): Type<CanActivate> {
  class MixinAuthGuard<TUser = any> implements CanActivate {
    constructor(@Optional() protected readonly options: AuthModuleOptions) {
      this.options = this.options || {};
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const options = { ...defaultOptions, ...this.options };
      const [request, response] = [
        this.getRequest(context),
        context.switchToHttp().getResponse(),
      ];
      const passportFn = createPassportContext(request, response);

      request[options.property || defaultOptions.property] = await passportFn(
        // changed
        request.body.provider || this.options.defaultStrategy,
        options,
        (err, user, info, status) =>
          this.handleRequest(err, user, info, context, status),
      );
      return true;
    }

    getRequest<T = any>(context: ExecutionContext): T {
      return context.switchToHttp().getRequest();
    }

    async logIn<
      TRequest extends {
        logIn: (user: any, callback: (...args: any[]) => any) => Promise<void>;
      } = any,
    >(request: TRequest): Promise<void> {
      const user = request[this.options.property || defaultOptions.property];
      await new Promise<void>((resolve, reject) =>
        request.logIn(user, (err) => (err ? reject(err) : resolve())),
      );
    }

    handleRequest(err, user, _info, _context, _status): TUser {
      if (err || !user) {
        throw err || new UnauthorizedException();
      }
      return user;
    }
  }
  return mixin(MixinAuthGuard);
}

const createPassportContext =
  (request, response) => (type, options, callback: (...args: any[]) => any) =>
    new Promise<void>((resolve, reject) =>
      passport.authenticate(type, options, (err, user, info, status) => {
        try {
          request.authInfo = info;
          return resolve(callback(err, user, info, status));
        } catch (err) {
          reject(err);
        }
      })(request, response, (err) => (err ? reject(err) : resolve())),
    );
