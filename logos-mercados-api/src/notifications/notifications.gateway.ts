import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, { socket: Socket; clientId?: string }> =
    new Map();

  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake auth or query params
      const token = this.extractToken(client);

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);

      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      // Store client connection with user ID
      this.connectedClients.set(client.id, {
        socket: client,
        clientId: payload.sub,
      });

      // Join client to their personal room for targeted notifications
      client.join(`client_${payload.sub}`);

      console.log(`Client ${client.id} connected for user ${payload.sub}`);

      // Send welcome message
      client.emit('connected', {
        message: 'Connected to notifications service',
        clientId: payload.sub,
      });
    } catch (error) {
      console.error('Connection error:', error.message);
      client.disconnect();
      throw new UnauthorizedException('Authentication failed');
    }
  }

  handleDisconnect(client: Socket) {
    const connectedClient = this.connectedClients.get(client.id);
    if (connectedClient) {
      console.log(
        `Client ${client.id} disconnected for user ${connectedClient.clientId}`,
      );
      this.connectedClients.delete(client.id);
    }
  }

  @SubscribeMessage('joinClientRoom')
  async handleJoinClientRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { clientId: string },
  ) {
    const connectedClient = this.connectedClients.get(client.id);
    if (!connectedClient) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    // Verify the client can join this room (should match their authenticated clientId)
    if (connectedClient.clientId !== data.clientId) {
      client.emit('error', { message: 'Unauthorized to join this room' });
      return;
    }

    client.join(`client_${data.clientId}`);
    client.emit('joinedRoom', { clientId: data.clientId });
  }

  @SubscribeMessage('leaveClientRoom')
  async handleLeaveClientRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { clientId: string },
  ) {
    const connectedClient = this.connectedClients.get(client.id);
    if (!connectedClient) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    client.leave(`client_${data.clientId}`);
    client.emit('leftRoom', { clientId: data.clientId });
  }

  // Method to send order status updates to specific clients
  async sendOrderStatusUpdate(clientId: string, orderData: any) {
    this.server.to(`client_${clientId}`).emit('orderStatusUpdate', {
      type: 'ORDER_STATUS_UPDATE',
      data: orderData,
      timestamp: new Date(),
    });
  }

  // Method to send custom notifications
  async sendCustomNotification(clientId: string, message: string, data?: any) {
    this.server.to(`client_${clientId}`).emit('customNotification', {
      type: 'CUSTOM_NOTIFICATION',
      message,
      data,
      timestamp: new Date(),
    });
  }

  // Method to broadcast to all authenticated clients
  async broadcastNotification(message: string, data?: any) {
    this.server.emit('broadcast', {
      type: 'BROADCAST',
      message,
      data,
      timestamp: new Date(),
    });
  }

  private extractToken(client: Socket): string | null {
    // Try to get token from handshake auth
    const authHeader = client.handshake.auth?.token;
    if (authHeader) {
      return authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;
    }

    // Try to get token from query params
    const tokenFromQuery = client.handshake.query?.token as string;
    if (tokenFromQuery) {
      return tokenFromQuery;
    }

    // Try to get token from headers
    const tokenFromHeader = client.handshake.headers?.authorization as string;
    if (tokenFromHeader) {
      return tokenFromHeader.startsWith('Bearer ')
        ? tokenFromHeader.slice(7)
        : tokenFromHeader;
    }

    return null;
  }

  // Get list of connected clients (for debugging/admin purposes)
  getConnectedClients() {
    return Array.from(this.connectedClients.entries()).map(
      ([socketId, client]) => ({
        socketId,
        clientId: client.clientId,
        connected: client.socket.connected,
      }),
    );
  }
}
