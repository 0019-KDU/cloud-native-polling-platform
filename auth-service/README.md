# Auth Service

Spring Boot service handling admin authentication and JWT token management.

## Port: 8081

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | Public | Admin login |
| POST | `/api/auth/register` | Public | Register new admin |
| GET | `/api/auth/validate` | Bearer | Validate token |
| GET | `/api/auth/health` | Public | Health check |
| GET | `/actuator/health` | Public | Actuator health |

## Example: Login

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "username": "admin",
  "email": "admin@polling.com",
  "role": "ROLE_ADMIN",
  "expiresIn": 86400000
}
```

## Local Development

```bash
# Start PostgreSQL
docker-compose up postgres -d

# Run service
./mvnw spring-boot:run
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| SPRING_DATASOURCE_URL | jdbc:postgresql://localhost:5432/pollingdb | DB URL |
| SPRING_DATASOURCE_USERNAME | polluser | DB username |
| SPRING_DATASOURCE_PASSWORD | pollpass | DB password |
| JWT_SECRET | (see .env) | JWT signing secret |
| JWT_EXPIRATION | 86400000 | Token TTL in ms (24h) |
