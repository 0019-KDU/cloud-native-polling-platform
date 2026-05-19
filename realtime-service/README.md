# Realtime Service

Node.js + Socket.IO service that subscribes to Redis Pub/Sub and broadcasts live vote updates to connected WebSocket clients.

## Port: 3001

## WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join:poll` | `pollId` | Subscribe to live updates for a poll |
| `leave:poll` | `pollId` | Unsubscribe from poll updates |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `vote:update` | `{pollId, results, totalVotes}` | New vote count for a poll |
| `joined` | `{pollId, room}` | Confirmation of room join |

## HTTP Endpoints

| Path | Description |
|------|-------------|
| `GET /health` | Health check |
| `GET /api/realtime/stats` | Connected clients count |

## Example Client (JavaScript)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.emit('join:poll', 1);

socket.on('vote:update', ({ pollId, results, totalVotes }) => {
  console.log('Live update:', { pollId, results, totalVotes });
});
```

## Data Flow

```
vote-service → Redis "vote:updates" → realtime-service → WebSocket → React frontend
```

## Local Development

```bash
npm install
npm run dev  # uses nodemon
```
