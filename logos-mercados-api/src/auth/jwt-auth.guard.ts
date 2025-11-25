import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { SystemRole } from '../entities/roles.enum';
import { JwtAuthService } from './jwt.service';
import { IS_PUBLIC_KEY } from './public.decorator';

export interface JwtPayload {
  sub: string;
  login: string;
  name: string;
  client_id?: string;
  system_role: SystemRole;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.header('Authorization');

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = this.jwtAuthService.verifyToken(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = payload;
    return true;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw (
        err || new UnauthorizedException('Authorization header is required')
      );
    }
    return user;
  }
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
