import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-auth.guard';
import { SystemRole } from '../entities/roles.enum';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: { 
    id: string; 
    login: string; 
    name: string; 
    client_id?: string;
    system_role: SystemRole;
  }): string {
    const payload: JwtPayload = {
      sub: user.id,
      login: user.login,
      name: user.name,
      client_id: user.client_id,
      system_role: user.system_role,
    };

    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
