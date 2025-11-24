import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { Promotion } from '../entities/promotion.entity';
import { PromotionClient } from '../entities/promotion-client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, PromotionClient])],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
