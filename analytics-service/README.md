# Analytics Service

FastAPI (Python) service providing poll analytics, vote statistics, and data aggregation.

## Port: 8084

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/analytics/polls` | Public | All polls summary |
| GET | `/api/analytics/polls/{id}` | Public | Detailed poll analytics |
| GET | `/api/analytics/stats` | Public | Platform-wide statistics |
| GET | `/api/analytics/health` | Public | Health check |
| GET | `/api/analytics/docs` | Public | Swagger UI |

## Example: Poll Analytics

```bash
curl http://localhost:8084/api/analytics/polls/1
```

Response:
```json
{
  "poll_id": 1,
  "poll_title": "Best Programming Language?",
  "poll_status": "ACTIVE",
  "total_votes": 100,
  "options": [
    {"option_id": 1, "option_text": "Python", "vote_count": 45, "percentage": 45.0},
    {"option_id": 2, "option_text": "Java", "vote_count": 30, "percentage": 30.0}
  ]
}
```

## Local Development

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8084
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | postgresql://... | PostgreSQL connection string |
