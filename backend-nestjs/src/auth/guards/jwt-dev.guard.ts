import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtDevGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (process.env.JWT_DEV_MODE !== 'true') {
      throw new UnauthorizedException('JWT_DEV_MODE is not enabled.');
    }

    const request = context.switchToHttp().getRequest();
    const defaultUserId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // A fixed UUID for default dev user
    const userId = request.headers['x-dev-user-id'] || defaultUserId;

    request.user = {
      id: userId,
      username: 'dev-user',
      roles: ['user'],
    };

    return true;
  }
}
