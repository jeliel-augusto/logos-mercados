import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './client.entity';
import { PromotionClient } from './promotion-client.entity';

export enum PromotionTargetType {
  ALL_PRODUCTS = 'all_products',
  GLOBAL_CATEGORY = 'global_category',
  CLIENT_CATEGORY = 'client_category',
  SPECIFIC_PRODUCTS = 'specific_products',
}

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  bgColor: string;

  @Column()
  textColor: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  discountPercentage: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: string;

  @OneToMany(() => PromotionClient, (promotionClient) => promotionClient.promotion, { cascade: true })
  promotionClients: PromotionClient[];
}
