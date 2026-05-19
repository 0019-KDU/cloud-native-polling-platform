# Poll Service

Spring Boot service managing poll lifecycle — creation, activation, ending, and retrieval.

## Port: 8082

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/polls` | Public | List all polls |
| GET | `/api/polls/active` | Public | List active polls |
| GET | `/api/polls/{id}` | Public | Get poll by ID |
| POST | `/api/polls` | Bearer (Admin) | Create new poll |
| PUT | `/api/polls/{id}/activate` | Bearer (Admin) | Activate a poll |
| PUT | `/api/polls/{id}/end` | Bearer (Admin) | End a poll |
| DELETE | `/api/polls/{id}` | Bearer (Admin) | Delete a poll |

## Example: Create Poll

```bash
curl -X POST http://localhost:8082/api/polls \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best Programming Language?",
    "description": "Vote for your favourite",
    "options": ["Python", "Java", "JavaScript", "Go"]
  }'
```

## Poll Status Flow

```
DRAFT → ACTIVE → ENDED
```

## Local Development

```bash
docker-compose up postgres -d
./mvnw spring-boot:run
```
