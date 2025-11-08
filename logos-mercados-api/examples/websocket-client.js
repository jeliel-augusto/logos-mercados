const { io } = require('socket.io-client');

// Configuration
const SERVER_URL = 'http://localhost:3000';
const JWT_TOKEN = 'your-jwt-token-here'; // Replace with actual JWT token

// Create socket connection
const socket = io(SERVER_URL, {
  auth: {
    token: JWT_TOKEN
  }
});

// Connection events
socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
  console.log('Socket ID:', socket.id);
});

socket.on('connected', (data) => {
  console.log('🔔 Authentication successful');
  console.log('Client ID:', data.clientId);
  console.log('Message:', data.message);
  
  // Join client room for targeted notifications
  socket.emit('joinClientRoom', { clientId: data.clientId });
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from WebSocket server');
});

// Notification events
socket.on('orderStatusUpdate', (data) => {
  console.log('📦 Order Status Update Received:');
  console.log('  Order ID:', data.data.orderId);
  console.log('  Client ID:', data.data.clientId);
  console.log('  Status:', data.data.status);
  console.log('  Message:', data.data.message);
  console.log('  Timestamp:', data.timestamp);
  console.log('---');
});

socket.on('customNotification', (data) => {
  console.log('📢 Custom Notification Received:');
  console.log('  Message:', data.message);
  console.log('  Data:', data.data);
  console.log('  Timestamp:', data.timestamp);
  console.log('---');
});

socket.on('broadcast', (data) => {
  console.log('📻 Broadcast Received:');
  console.log('  Message:', data.message);
  console.log('  Data:', data.data);
  console.log('  Timestamp:', data.timestamp);
  console.log('---');
});

// Room management events
socket.on('joinedRoom', (data) => {
  console.log('🏠 Joined room for client:', data.clientId);
});

socket.on('leftRoom', (data) => {
  console.log('🚪 Left room for client:', data.clientId);
});

// Error handling
socket.on('error', (error) => {
  console.error('❌ Socket Error:', error.message);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection Error:', error.message);
  console.log('Check your JWT token and server connection');
});

// Manual testing functions
function sendTestMessage() {
  console.log('📤 Sending test message...');
  socket.emit('testMessage', { message: 'Hello from client!' });
}

function joinTestRoom() {
  console.log('🏠 Joining test room...');
  socket.emit('joinClientRoom', { clientId: 'test-client-id' });
}

function leaveTestRoom() {
  console.log('🚪 Leaving test room...');
  socket.emit('leaveClientRoom', { clientId: 'test-client-id' });
}

// Instructions
console.log('🚀 WebSocket Client Example');
console.log('==========================');
console.log('Make sure the server is running on http://localhost:3000');
console.log('Replace JWT_TOKEN with a valid token from your authentication system');
console.log('');
console.log('Available commands:');
console.log('  sendTestMessage()  - Send a test message');
console.log('  joinTestRoom()     - Join a test room');
console.log('  leaveTestRoom()    - Leave a test room');
console.log('');
console.log('To test order notifications:');
console.log('1. Create an order via REST API');
console.log('2. Update order status via PATCH /order/:id/status');
console.log('3. Watch for real-time notifications here');
console.log('');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Disconnecting...');
  socket.disconnect();
  process.exit(0);
});

module.exports = {
  sendTestMessage,
  joinTestRoom,
  leaveTestRoom
};
