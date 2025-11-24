import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Product } from './product.entity';
import { GlobalCategory } from './global-category.entity';

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
  client: Client;

  @Column({ name: 'global_category_id', nullable: true })
  global_category_id?: string;

  @ManyToOne(() => GlobalCategory, { nullable: true })
  @JoinColumn({ name: 'global_category_id' })
  globalCategory?: GlobalCategory;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
