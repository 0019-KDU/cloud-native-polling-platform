const { Server } = require('socket.io');
const { createRedisClient, VOTE_CHANNEL } = require('../config/redis');

function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  const subscriber = createRedisClient('subscriber');

  subscriber.subscribe(VOTE_CHANNEL, (err, count) => {
    if (err) {
      console.error('[Redis] Failed to subscribe:', err.message);
      return;
    }
    console.log(`[Redis] Subscribed to "${VOTE_CHANNEL}" (${count} subscription(s))`);
  });

  subscriber.on('message', (channel, message) => {
    if (channel !== VOTE_CHANNEL) return;
    try {
      const event = JSON.parse(message);
      const { pollId, results, totalVotes } = event;

      // Broadcast to all clients watching this poll
      io.to(`poll:${pollId}`).emit('vote:update', { pollId, results, totalVotes });
      console.log(`[Socket.IO] Broadcast vote update for poll ${pollId} (${totalVotes} total votes)`);
    } catch (err) {
      console.error('[Socket.IO] Failed to parse message:', err.message);
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('join:poll', (pollId) => {
      const room = `poll:${pollId}`;
      socket.join(room);
      console.log(`[Socket.IO] ${socket.id} joined room ${room}`);
      socket.emit('joined', { pollId, room });
    });

    socket.on('leave:poll', (pollId) => {
      const room = `poll:${pollId}`;
      socket.leave(room);
      console.log(`[Socket.IO] ${socket.id} left room ${room}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id} (${reason})`);
    });

    socket.on('error', (err) => {
      console.error(`[Socket.IO] Socket error for ${socket.id}:`, err.message);
    });
  });

  return io;
}

module.exports = { setupSocketServer };
