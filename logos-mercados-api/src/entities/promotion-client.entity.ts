import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Promotion, PromotionTargetType } from './promotion.entity';
import { GlobalCategory } from './global-category.entity';
import { ClientCategory } from './client-category.entity';
import { Product } from './product.entity';

@Entity()
export class PromotionClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Promotion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @Column({ name: 'promotion_id' })
  promotionId: string;

  @Column({
    type: 'enum',
    enum: PromotionTargetType,
  })
  targetType: PromotionTargetType;

  // For GLOBAL_CATEGORY type
  @ManyToOne(() => GlobalCategory, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'global_category_id' })
  globalCategory: GlobalCategory;

  @Column({ name: 'global_category_id', nullable: true })
  globalCategoryId: string;

  // For CLIENT_CATEGORY type
  @ManyToOne(() => ClientCategory, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_category_id' })
  clientCategory: ClientCategory;

  @Column({ name: 'client_category_id', nullable: true })
  clientCategoryId: string;

  // For SPECIFIC_PRODUCTS type
  @ManyToOne(() => Product, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', nullable: true })
  productId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
