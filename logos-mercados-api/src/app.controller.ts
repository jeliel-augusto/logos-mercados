import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { SystemRole } from './entities/roles.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.ADMIN, SystemRole.SUPER_ADMIN)
  getAdminOnly(): string {
    return 'Admin access granted';
  }

  @Get('super-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.SUPER_ADMIN)
  getSuperAdminOnly(): string {
    return 'Super Admin access granted';
  }

  @Get('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.CLIENT, SystemRole.ADMIN, SystemRole.SUPER_ADMIN)
  getClientAccess(): string {
    return 'Client access granted';
  }
}
