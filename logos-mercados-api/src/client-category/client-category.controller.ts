import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientCategoryService } from './client-category.service';
import type { CreateClientCategoryDto } from './client-category.service';

@Controller('client-category')
export class ClientCategoryController {
  constructor(private readonly clientCategoryService: ClientCategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClientCategoryDto: CreateClientCategoryDto) {
    return this.clientCategoryService.create(createClientCategoryDto);
  }

  @Get()
  findAll() {
    return this.clientCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientCategoryService.findOne(id);
  }
}
