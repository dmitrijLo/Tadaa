import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { DEV_BYPASS_KEY } from '../decorators/dev-bypass.decorator';

@Injectable()
export class DevAwareAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const hasDevBypass = this.reflector.getAllAndOverride<boolean>(DEV_BYPASS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (hasDevBypass && process.env.NODE_ENV !== 'production') {
      const request = context.switchToHttp().getRequest();
      // Only inject dev user if no real auth is present (header or cookie)
      if (!request.headers['authorization'] && !request.cookies?.accessToken) {
        const defaultUserId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
        const userId = request.headers['x-dev-user-id'] || defaultUserId;
        request.user = { id: userId, username: 'dev-user', roles: ['user'] };
        return true;
      }
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
