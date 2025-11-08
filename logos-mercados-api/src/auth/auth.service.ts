import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtAuthService } from './jwt.service';
import { PasswordUtils } from '../utils/password.utils';

export interface LoginDto {
  login: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    login: string;
    name: string;
    client_id?: string;
    system_role: string;
  };
}

interface UserWithPassword extends Omit<User, 'password_hash'> {
  password_hash: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async validateUser(
    login: string,
    password: string,
  ): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.userRepository.findOne({
      where: { login },
      select: [
        'id',
        'login',
        'name',
        'password_hash',
        'client_id',
        'system_role',
      ],
    });

    if (
      user &&
      user.password_hash &&
      (await PasswordUtils.compare(password, user.password_hash))
    ) {
      const { password_hash: _passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { login, password } = loginDto;

    const user = await this.validateUser(login, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = this.jwtAuthService.generateToken({
      id: user.id,
      login: user.login,
      name: user.name,
      client_id: user.client_id,
      system_role: user.system_role,
    });

    return {
      access_token,
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        client_id: user.client_id,
        system_role: user.system_role,
      },
    };
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'login',
        'name',
        'client_id',
        'system_role',
        'created_at',
        'updated_at',
      ],
    });
  }
}
