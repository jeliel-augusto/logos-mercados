import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { OrderProduct } from './order-product.entity';

export enum OrderStatus {
  CREATED = 'CREATED',
  ACCEPTED = 'ACCEPTED',
  IN_DELIVERY = 'IN_DELIVERY',
  CONCLUDED = 'CONCLUDED',
}

@Entity()
@Index(['client_id'])
@Index(['requested_at'])
@Index(['location_lat', 'location_long'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'client_id' })
  client_id: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status: OrderStatus;

  @Column({ name: 'requested_at', type: 'timestamp', nullable: true })
  requested_at: Date;

  @Column({ name: 'accepted_at', type: 'timestamp', nullable: true })
  accepted_at: Date;

  @Column({ name: 'whatsapp_contact', nullable: true })
  whatsapp_contact: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({
    name: 'location_lat',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  location_lat: number;

  @Column({
    name: 'location_long',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  location_long: number;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  client: Client;

  @OneToMany(
    () => OrderProduct,
    (orderProduct: OrderProduct) => orderProduct.order,
    { cascade: true },
  )
  orderProducts: OrderProduct[];
}
