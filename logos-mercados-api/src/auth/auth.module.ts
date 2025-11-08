import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AuthController } from './auth.controller';
import { JwtAuthService } from './jwt.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtAuthService, JwtAuthGuard, RolesGuard],
  exports: [AuthService, UserService, JwtAuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
