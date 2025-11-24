import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { SystemRole } from 'src/entities/roles.enum';
import { GlobalCategory } from '../entities/global-category.entity';
import { GlobalCategoryService } from './global-category.service';

@Controller('global-categories')
export class GlobalCategoryController {
  constructor(private readonly globalCategoryService: GlobalCategoryService) {}

  @Post()
  @Roles(SystemRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() createGlobalCategoryDto: Partial<GlobalCategory>) {
    const globalCategory = await this.globalCategoryService.create(
      createGlobalCategoryDto,
    );
    return {
      success: true,
      data: globalCategory,
      message: 'Global category created successfully',
    };
  }

  @Get()
  async findAll() {
    const globalCategories = await this.globalCategoryService.findAll();
    return globalCategories;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const globalCategory = await this.globalCategoryService.findOne(id);

    if (!globalCategory) {
      return {
        success: false,
        message: 'Global category not found',
      };
    }

    return {
      success: true,
      data: globalCategory,
      message: 'Global category retrieved successfully',
    };
  }

  @Get(':id/products')
  @Roles(SystemRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async findOneWithProducts(
    @Param('id') id: string,
    @Query('page') page: string = '1',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const globalCategory = await this.globalCategoryService.findOneWithProducts(
      id,
      pageNum,
    );

    if (!globalCategory) {
      return {
        success: false,
        message: 'Global category not found',
      };
    }

    return {
      success: true,
      data: globalCategory,
      message: 'Global category with products retrieved successfully',
      pagination: {
        page: pageNum,
        limit: 50,
      },
    };
  }

  @Patch(':id')
  @Roles(SystemRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateGlobalCategoryDto: Partial<GlobalCategory>,
  ) {
    const globalCategory = await this.globalCategoryService.update(
      id,
      updateGlobalCategoryDto,
    );

    if (!globalCategory) {
      return {
        success: false,
        message: 'Global category not found',
      };
    }

    return {
      success: true,
      data: globalCategory,
      message: 'Global category updated successfully',
    };
  }

  @Delete(':id')
  @Roles(SystemRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.globalCategoryService.remove(id);
  }

  @Get('icon/:iconName')
  @Roles(SystemRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async findByIconName(@Param('iconName') iconName: string) {
    const globalCategory =
      await this.globalCategoryService.findByIconName(iconName);

    if (!globalCategory) {
      return {
        success: false,
        message: 'Global category not found with this icon name',
      };
    }

    return {
      success: true,
      data: globalCategory,
      message: 'Global category retrieved successfully',
    };
  }
}
