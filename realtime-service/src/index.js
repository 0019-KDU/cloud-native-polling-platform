require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupSocketServer } = require('./socket/socketHandler');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'realtime-service' });
});

app.get('/api/realtime/health', (req, res) => {
  res.json({ status: 'UP', service: 'realtime-service' });
});

const httpServer = http.createServer(app);
const io = setupSocketServer(httpServer);

// Expose connected clients count
app.get('/api/realtime/stats', (req, res) => {
  res.json({
    connectedClients: io.engine.clientsCount,
    service: 'realtime-service',
  });
});

httpServer.listen(PORT, () => {
  console.log(`[realtime-service] Running on http://0.0.0.0:${PORT}`);
  console.log(`[realtime-service] WebSocket ready`);
});

process.on('uncaughtException', (err) => {
  console.error('[realtime-service] Uncaught exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[realtime-service] Unhandled rejection:', reason);
});
