import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Promotion } from '../entities/promotion.entity';
import { PromotionClient } from '../entities/promotion-client.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(PromotionClient)
    private readonly promotionClientRepository: Repository<PromotionClient>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion | null> {
    const { promotionClients, ...promotionData } = createPromotionDto;
    
    const promotion = this.promotionRepository.create(promotionData);
    const savedPromotion = await this.promotionRepository.save(promotion);

    // Create promotion clients
    for (const clientData of promotionClients) {
      const promotionClient = this.promotionClientRepository.create({
        ...clientData,
        promotionId: savedPromotion.id,
      });
      await this.promotionClientRepository.save(promotionClient);
    }

    return this.findOne(savedPromotion.id);
  }

  async findAll(clientId?: string): Promise<Promotion[]> {
    const whereClause: any = {
      isActive: true,
    };

    if (clientId) {
      whereClause.clientId = clientId;
    }

    return this.promotionRepository.find({
      where: whereClause,
      relations: ['promotionClients', 'promotionClients.globalCategory', 'promotionClients.clientCategory', 'promotionClients.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActivePromotions(clientId?: string): Promise<Promotion[]> {
    const now = new Date();
    
    const whereClause: any = {
      isActive: true,
      startDate: LessThanOrEqual(now),
      endDate: MoreThanOrEqual(now),
    };

    if (clientId) {
      whereClause.clientId = clientId;
    }

    return this.promotionRepository.find({
      where: whereClause,
      relations: ['promotionClients', 'promotionClients.globalCategory', 'promotionClients.clientCategory', 'promotionClients.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Promotion | null> {
    return this.promotionRepository.findOne({
      where: { id },
      relations: ['promotionClients', 'promotionClients.globalCategory', 'promotionClients.clientCategory', 'promotionClients.product'],
    });
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion | null> {
    const { promotionClients, ...promotionData } = updatePromotionDto;
    
    await this.promotionRepository.update(id, promotionData);

    // Update promotion clients if provided
    if (promotionClients) {
      // Remove existing promotion clients
      await this.promotionClientRepository.delete({ promotionId: id });
      
      // Create new promotion clients
      for (const clientData of promotionClients) {
        const promotionClient = this.promotionClientRepository.create({
          ...clientData,
          promotionId: id,
        });
        await this.promotionClientRepository.save(promotionClient);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.promotionClientRepository.delete({ promotionId: id });
    await this.promotionRepository.update(id, { isActive: false });
  }

  async findPromotionsForProduct(productId: string, clientId: string): Promise<Promotion[]> {
    const now = new Date();
    
    return this.promotionRepository
      .createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.promotionClients', 'promotionClient')
      .where('promotion.clientId = :clientId', { clientId })
      .andWhere('promotion.isActive = :isActive', { isActive: true })
      .andWhere('promotion.startDate <= :now', { now })
      .andWhere('promotion.endDate >= :now', { now })
      .andWhere(
        '(promotionClient.targetType = :allProducts OR promotionClient.productId = :productId)',
        { allProducts: 'all_products', productId }
      )
      .getMany();
  }

  async findPromotionsForClientCategory(clientCategoryId: string, clientId: string): Promise<Promotion[]> {
    const now = new Date();
    
    return this.promotionRepository
      .createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.promotionClients', 'promotionClient')
      .where('promotion.clientId = :clientId', { clientId })
      .andWhere('promotion.isActive = :isActive', { isActive: true })
      .andWhere('promotion.startDate <= :now', { now })
      .andWhere('promotion.endDate >= :now', { now })
      .andWhere(
        '(promotionClient.targetType = :allProducts OR promotionClient.clientCategoryId = :clientCategoryId)',
        { allProducts: 'all_products', clientCategoryId }
      )
      .getMany();
  }

  async findPromotionsForGlobalCategory(globalCategoryId: string, clientId: string): Promise<Promotion[]> {
    const now = new Date();
    
    return this.promotionRepository
      .createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.promotionClients', 'promotionClient')
      .where('promotion.clientId = :clientId', { clientId })
      .andWhere('promotion.isActive = :isActive', { isActive: true })
      .andWhere('promotion.startDate <= :now', { now })
      .andWhere('promotion.endDate >= :now', { now })
      .andWhere(
        '(promotionClient.targetType = :allProducts OR promotionClient.globalCategoryId = :globalCategoryId)',
        { allProducts: 'all_products', globalCategoryId }
      )
      .getMany();
  }
}
