# Vote Service

Spring Boot service that accepts votes, prevents duplicates via fingerprinting, and publishes real-time events to Redis Pub/Sub.

## Port: 8083

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/votes` | Public | Cast a vote |
| GET | `/api/votes/results/{pollId}` | Public | Get vote results |
| GET | `/api/votes/health` | Public | Health check |

## Example: Cast Vote

```bash
curl -X POST http://localhost:8083/api/votes \
  -H "Content-Type: application/json" \
  -d '{"pollId": 1, "optionId": 2}'
```

## Duplicate Vote Prevention

Votes are deduplicated using a SHA-256 fingerprint of `IP + User-Agent`. One vote per user per poll.

## Redis Pub/Sub

After each vote, an event is published to channel `vote:updates`:

```json
{
  "pollId": 1,
  "results": {"1": 42, "2": 58},
  "totalVotes": 100
}
```

## Local Development

```bash
docker-compose up postgres redis -d
./mvnw spring-boot:run
```
