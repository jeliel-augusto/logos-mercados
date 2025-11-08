import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
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
  client: Client;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
