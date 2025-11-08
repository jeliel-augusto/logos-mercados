import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController, OrdersController } from './order.controller';
import { Order } from '../entities/order.entity';
import { OrderProduct } from '../entities/order-product.entity';
import { Product } from '../entities/product.entity';
import { Client } from '../entities/client.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct, Product, Client]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [OrderController, OrdersController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
