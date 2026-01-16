import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * extracts user from request object ('req.user')
 * REQUIRED: AuthGuard must be active on route
 */

export const UserFromRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException(
        'No user found in request. Did you forget to add AuthGuard?',
      );
    }

    return request.user;
  },
);
