import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../entities/order.entity';
import { NotificationsGateway } from './notifications.gateway';

export interface NotificationPayload {
  orderId: string;
  clientId: string;
  status: OrderStatus;
  message: string;
  timestamp: Date;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async sendOrderStatusUpdate(
    order: Order,
    newStatus: OrderStatus,
  ): Promise<void> {
    const notificationPayload: NotificationPayload = {
      orderId: order.id,
      clientId: order.client_id,
      status: newStatus,
      message: this.generateStatusMessage(newStatus),
      timestamp: new Date(),
    };

    // Send real-time notification via WebSocket
    await this.notificationsGateway.sendOrderStatusUpdate(
      order.client_id,
      notificationPayload,
    );

    // Mock notification sending - in real implementation this would:
    // - Send push notification
    // - Send SMS/WhatsApp message
    // - Send email

    this.logger.log(
      `Notification sent: ${JSON.stringify(notificationPayload)}`,
    );

    // Simulate async notification sending
    await this.simulateNotificationSend(notificationPayload);
  }

  private generateStatusMessage(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.CREATED:
        return 'Your order has been received and is being processed.';
      case OrderStatus.ACCEPTED:
        return 'Your order has been accepted and is being prepared.';
      case OrderStatus.IN_DELIVERY:
        return 'Your order is out for delivery!';
      case OrderStatus.CONCLUDED:
        return 'Your order has been delivered. Enjoy!';
      default:
        return 'Order status updated.';
    }
  }

  private async simulateNotificationSend(
    payload: NotificationPayload,
  ): Promise<void> {
    // Mock async operation - simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        this.logger.log(
          `External notification sent for order ${payload.orderId}`,
        );
        resolve();
      }, 100);
    });
  }

  async sendCustomNotification(
    clientId: string,
    message: string,
    data?: any,
  ): Promise<void> {
    const payload = {
      clientId,
      message,
      timestamp: new Date(),
      data,
    };

    // Send real-time notification via WebSocket
    await this.notificationsGateway.sendCustomNotification(
      clientId,
      message,
      data,
    );

    this.logger.log(`Custom notification sent: ${JSON.stringify(payload)}`);

    // Mock sending
    await this.simulateNotificationSend(payload as any);
  }

  async broadcastNotification(message: string, data?: any): Promise<void> {
    const payload = {
      message,
      timestamp: new Date(),
      data,
    };

    // Send broadcast via WebSocket
    await this.notificationsGateway.broadcastNotification(message, data);

    this.logger.log(`Broadcast notification sent: ${JSON.stringify(payload)}`);
  }

  // Get connected clients for debugging
  getConnectedClients() {
    return this.notificationsGateway.getConnectedClients();
  }
}
