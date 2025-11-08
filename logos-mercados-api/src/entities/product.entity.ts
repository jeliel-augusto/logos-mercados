import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from './client.entity';
import { ClientCategory } from './client-category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'client_id' })
  client_id: string;

  @Column({ name: 'category_id', nullable: true })
  category_id: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  client: Client;

  @ManyToOne(() => ClientCategory, { onDelete: 'SET NULL' })
  category: ClientCategory;
}
