# WebSocket Notifications

This application supports real-time notifications using Socket.IO with JWT authentication.

## Connection

To connect to the WebSocket server, you need a valid JWT token:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token' // or 'Bearer your-jwt-token'
  }
});
```

### Alternative Authentication Methods

You can also provide the token via:
- Query parameter: `?token=your-jwt-token`
- Authorization header: `Authorization: Bearer your-jwt-token`

## Events

### Client Events

#### Join Client Room
```javascript
socket.emit('joinClientRoom', { clientId: 'client-uuid' });
```

#### Leave Client Room
```javascript
socket.emit('leaveClientRoom', { clientId: 'client-uuid' });
```

### Server Events

#### Connection Confirmation
```javascript
socket.on('connected', (data) => {
  console.log('Connected:', data.message);
  console.log('Client ID:', data.clientId);
});
```

#### Order Status Updates
```javascript
socket.on('orderStatusUpdate', (data) => {
  console.log('Order Status Update:', data);
  // data structure:
  // {
  //   type: 'ORDER_STATUS_UPDATE',
  //   data: {
  //     orderId: 'order-uuid',
  //     clientId: 'client-uuid',
  //     status: 'ACCEPTED',
  //     message: 'Your order has been accepted...',
  //     timestamp: '2025-11-08T...'
  //   },
  //   timestamp: '2025-11-08T...'
  // }
});
```

#### Custom Notifications
```javascript
socket.on('customNotification', (data) => {
  console.log('Custom Notification:', data);
  // data structure:
  // {
  //   type: 'CUSTOM_NOTIFICATION',
  //   message: 'Your custom message',
  //   data: { /* additional data */ },
  //   timestamp: '2025-11-08T...'
  // }
});
```

#### Broadcast Messages
```javascript
socket.on('broadcast', (data) => {
  console.log('Broadcast:', data);
  // data structure:
  // {
  //   type: 'BROADCAST',
  //   message: 'Broadcast message',
  //   data: { /* additional data */ },
  //   timestamp: '2025-11-08T...'
  // }
});
```

#### Room Management
```javascript
socket.on('joinedRoom', (data) => {
  console.log('Joined room:', data.clientId);
});

socket.on('leftRoom', (data) => {
  console.log('Left room:', data.clientId);
});
```

#### Error Handling
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error.message);
});
```

## Order Status Flow

Orders follow this status progression:
- `CREATED` → `ACCEPTED` → `IN_DELIVERY` → `CONCLUDED`

When an order status is updated via the REST API (`PATCH /order/:id/status`), all connected clients for that order's client will receive a real-time notification.

## Example Usage

```javascript
// Connect with JWT token
const socket = io('http://localhost:3000', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connected', (data) => {
  console.log('Connected as client:', data.clientId);
  
  // Join specific client room for targeted notifications
  socket.emit('joinClientRoom', { clientId: data.clientId });
});

socket.on('orderStatusUpdate', (notification) => {
  console.log('Order status changed:', notification.data.status);
  console.log('Order ID:', notification.data.orderId);
  console.log('Message:', notification.data.message);
  
  // Update UI based on status
  updateOrderStatus(notification.data);
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});

function updateOrderStatus(orderData) {
  // Your UI update logic here
  switch(orderData.status) {
    case 'CREATED':
      showOrderCreatedNotification(orderData);
      break;
    case 'ACCEPTED':
      showOrderAcceptedNotification(orderData);
      break;
    case 'IN_DELIVERY':
      showOrderInDeliveryNotification(orderData);
      break;
    case 'CONCLUDED':
      showOrderCompletedNotification(orderData);
      break;
  }
}
```

## Security

- All connections require valid JWT authentication
- Clients can only join rooms for their own authenticated client ID
- Tokens are verified on connection
- Invalid or missing tokens result in immediate disconnection

## CORS Configuration

The WebSocket gateway is configured to accept connections from any origin with GET and POST methods. For production, you should restrict this to your specific frontend domains.
