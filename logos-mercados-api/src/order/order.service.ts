import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderProduct } from '../entities/order-product.entity';
import { Product } from '../entities/product.entity';
import { Client } from '../entities/client.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Additional validation in case ValidationPipe doesn't catch everything
    if (!createOrderDto.client_id) {
      throw new BadRequestException('Client ID is required');
    }

    // Check if client exists
    const client = await this.clientRepository.findOne({
      where: { id: createOrderDto.client_id },
    });

    if (!client) {
      throw new NotFoundException(
        `Client with ID ${createOrderDto.client_id} not found`,
      );
    }

    // Validate products exist
    await this.validateProducts(createOrderDto.order_products);

    // Create order
    const order = this.orderRepository.create({
      name: createOrderDto.name,
      address: createOrderDto.address,
      whatsapp_contact: createOrderDto.whatsapp_contact,
      client_id: createOrderDto.client_id,
      requested_at: new Date(),
      status: OrderStatus.CREATED,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order products
    const orderProducts = createOrderDto.order_products.map((op) => ({
      order_id: savedOrder.id,
      product_id: op.product_id,
      quantity: op.quantity,
      total_value: op.total_value,
    }));

    await this.orderProductRepository.save(orderProducts);

    // Send notification for order creation
    await this.notificationsService.sendOrderStatusUpdate(
      savedOrder,
      OrderStatus.CREATED,
    );

    // Return order with products
    return this.findOne(savedOrder.id);
  }

  async updateOrderStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderProducts', 'orderProducts.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const oldStatus = order.status;
    const newStatus = updateOrderStatusDto.status;

    // Validate status transition
    this.validateStatusTransition(oldStatus, newStatus);

    // Update order status
    order.status = newStatus;

    // Update timestamps based on status
    if (newStatus === OrderStatus.ACCEPTED && !order.accepted_at) {
      order.accepted_at = new Date();
    }

    const updatedOrder = await this.orderRepository.save(order);

    // Send notification for status update
    await this.notificationsService.sendOrderStatusUpdate(
      updatedOrder,
      newStatus,
    );

    return updatedOrder;
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.CREATED]: [OrderStatus.ACCEPTED, OrderStatus.CONCLUDED],
      [OrderStatus.ACCEPTED]: [OrderStatus.IN_DELIVERY, OrderStatus.CONCLUDED],
      [OrderStatus.IN_DELIVERY]: [OrderStatus.CONCLUDED],
      [OrderStatus.CONCLUDED]: [], // No transitions from concluded
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  private async validateProducts(orderProducts: any[]): Promise<void> {
    for (const op of orderProducts) {
      const product = await this.productRepository.findOne({
        where: { id: op.product_id },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${op.product_id} not found`,
        );
      }
    }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderProducts', 'orderProducts.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [orders, total] = await this.orderRepository.findAndCount({
      relations: ['orderProducts', 'orderProducts.product'],
      skip,
      take: limit,
      order: { requested_at: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
