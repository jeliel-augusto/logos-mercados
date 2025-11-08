import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class OrderProduct {
  @PrimaryColumn({ name: 'order_id' })
  order_id: string;

  @PrimaryColumn({ name: 'product_id' })
  product_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'total_value', type: 'decimal', precision: 10, scale: 2 })
  total_value: number;

  @ManyToOne(() => Order, order => order.orderProducts, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;
}
