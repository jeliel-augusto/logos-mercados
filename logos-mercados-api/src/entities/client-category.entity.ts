import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { GlobalCategory } from './global-category.entity';
import { Product } from './product.entity';

@Entity()
@Index(['client_id'])
export class ClientCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'client_id' })
  client_id: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'global_category_id', nullable: true })
  global_category_id?: string;

  @ManyToOne(() => GlobalCategory, { nullable: true })
  @JoinColumn({ name: 'global_category_id' })
  globalCategory?: GlobalCategory;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
