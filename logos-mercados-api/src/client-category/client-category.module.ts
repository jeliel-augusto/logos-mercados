import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientCategoryService } from './client-category.service';
import { ClientCategoryController } from './client-category.controller';
import { ClientCategory } from '../entities/client-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientCategory])],
  controllers: [ClientCategoryController],
  providers: [ClientCategoryService],
  exports: [ClientCategoryService],
})
export class ClientCategoryModule {}
