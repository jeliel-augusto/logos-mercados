import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalCategory } from '../entities/global-category.entity';
import { GlobalCategoryService } from './global-category.service';
import { GlobalCategoryController } from './global-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalCategory])],
  controllers: [GlobalCategoryController],
  providers: [GlobalCategoryService],
  exports: [GlobalCategoryService],
})
export class GlobalCategoryModule {}
