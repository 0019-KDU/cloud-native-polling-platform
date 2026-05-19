# Real-Time Polling Platform

A production-style polyglot microservices polling system with live vote updates.

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend  │───▶│ auth-service │    │ poll-service │
│   (React)   │    │ (Spring Boot)│    │(Spring Boot) │
│  Port: 3000 │    │  Port: 8081  │    │  Port: 8082  │
└──────┬──────┘    └──────────────┘    └──────────────┘
       │                                      │
       │           ┌──────────────┐    ┌──────▼──────┐
       │           │analytics-svc │    │ vote-service│
       │           │  (FastAPI)   │    │(Spring Boot)│
       │           │  Port: 8084  │    │  Port: 8083 │
       │           └──────────────┘    └──────┬──────┘
       │                                      │ Redis Pub/Sub
       │           ┌──────────────┐    ┌──────▼──────┐
       └──────────▶│realtime-svc  │◀───│    Redis    │
       WebSocket   │ (Node.js)    │    │  Port: 6379 │
                   │  Port: 3001  │    └─────────────┘
                   └──────────────┘
                                         PostgreSQL
                                          Port: 5432
```

## Services

| Service | Technology | Port | Responsibility |
|---------|-----------|------|----------------|
| auth-service | Spring Boot | 8081 | JWT authentication, admin management |
| poll-service | Spring Boot | 8082 | Poll CRUD, option management |
| vote-service | Spring Boot | 8083 | Vote processing, Redis pub/sub |
| analytics-service | FastAPI (Python) | 8084 | Stats, aggregation, reporting |
| realtime-service | Node.js + Socket.IO | 3001 | WebSocket, live updates |
| frontend | React | 3000 | Admin dashboard, public voting UI |

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 17+ (for local dev)
- Python 3.11+ (for local dev)
- Node.js 18+ (for local dev)

### Run with Docker Compose

```bash
cd cloud-native-polling-platform
docker-compose up -d
docker-compose logs -f
```

### Access Points
- **Frontend**: http://localhost:3000
- **Auth API**: http://localhost:8081/api/auth
- **Poll API**: http://localhost:8082/api/polls
- **Vote API**: http://localhost:8083/api/votes
- **Analytics API**: http://localhost:8084/api/analytics
- **WebSocket**: ws://localhost:3001

### Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## Application Flow

1. Admin logs in at `/login`
2. Admin creates a poll with options
3. Poll becomes active — public users access `/poll/:id`
4. User votes → vote-service stores in PostgreSQL
5. vote-service publishes event to Redis channel `vote:updates`
6. realtime-service receives Redis event via Pub/Sub
7. WebSocket broadcasts updated results to all connected clients
8. React frontend updates charts instantly without page refresh
