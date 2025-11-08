import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthService } from './jwt.service';
import { SystemRole } from '../entities/roles.enum';

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
  constructor(private readonly jwtAuthService: JwtAuthService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = this.jwtAuthService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const payload = this.jwtAuthService.verifyToken(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
