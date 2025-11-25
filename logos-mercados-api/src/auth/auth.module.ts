import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';
import { PublicGuard } from './public.guard';
import { RolesGuard } from './roles.guard';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtAuthService,
    JwtAuthGuard,
    JwtStrategy,
    PublicGuard,
    RolesGuard,
  ],
  exports: [AuthService, UserService, JwtAuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
