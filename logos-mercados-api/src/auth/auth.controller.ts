import { Request } from 'express';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService, type AuthResponse } from './auth.service';
import { UserService, type CreateUserDto } from './user.service';
import { JwtAuthGuard, JwtPayload } from './jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

type LoginDto = {
  login: string;
  password: string;
};

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: Object })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: AuthenticatedRequest) {
    return {
      id: req.user.sub,
      login: req.user.login,
      name: req.user.name,
      client_id: req.user.client_id,
    };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate JWT token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async validateToken(@Req() req: AuthenticatedRequest) {
    return {
      valid: true,
      user: {
        id: req.user.sub,
        login: req.user.login,
        name: req.user.name,
        client_id: req.user.client_id,
      },
    };
  }
}
