import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SystemRole } from '../entities/roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @Roles(SystemRole.ADMIN, SystemRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.create(createPromotionDto);
  }

  @Get()
  findAll(@Query('clientId') clientId?: string) {
    return this.promotionService.findAll(clientId);
  }

  @Get('active')
  findActive(@Query('clientId') clientId?: string) {
    return this.promotionService.findActivePromotions(clientId);
  }

  @Get('product/:productId')
  findPromotionsForProduct(
    @Param('productId') productId: string,
    @Query('clientId') clientId: string,
  ) {
    return this.promotionService.findPromotionsForProduct(productId, clientId);
  }

  @Get('client-category/:clientCategoryId')
  findPromotionsForClientCategory(
    @Param('clientCategoryId') clientCategoryId: string,
    @Query('clientId') clientId: string,
  ) {
    return this.promotionService.findPromotionsForClientCategory(clientCategoryId, clientId);
  }

  @Get('global-category/:globalCategoryId')
  findPromotionsForGlobalCategory(
    @Param('globalCategoryId') globalCategoryId: string,
    @Query('clientId') clientId: string,
  ) {
    return this.promotionService.findPromotionsForGlobalCategory(globalCategoryId, clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionService.findOne(id);
  }

  @Patch(':id')
  @Roles(SystemRole.ADMIN, SystemRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  @Roles(SystemRole.ADMIN, SystemRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id);
  }
}
