import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { SystemRole } from '../entities/roles.enum';
import { JwtPayload } from './jwt-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<SystemRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User authentication required');
    }

    const hasRequiredRole = requiredRoles.some(
      (role) => user.system_role === role,
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Access denied. Required role: ${requiredRoles.join(' or ')}. Current role: ${user.system_role}`,
      );
    }

    return true;
  }
}
