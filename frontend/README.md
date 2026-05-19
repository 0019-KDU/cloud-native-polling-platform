# Frontend

React application providing the admin dashboard and public voting interface with live real-time updates.

## Port: 3000 (dev) / 80 (Docker)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Public poll list (active polls) |
| `/poll/:id` | Vote on a poll + live results |
| `/login` | Admin login |
| `/admin` | Admin dashboard (protected) |
| `/analytics/:id` | Poll analytics with charts |

## Features

- **Admin Dashboard**: Create polls, activate/end polls, view stats
- **Public Voting**: Vote on active polls with duplicate prevention
- **Live Results**: Real-time vote counts via WebSocket (Socket.IO)
- **Analytics**: Doughnut + bar charts via Chart.js
- **Responsive**: Works on mobile and desktop

## Local Development

```bash
npm install
npm start
```

The app runs on `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file:

```env
REACT_APP_AUTH_SERVICE_URL=http://localhost:8081
REACT_APP_POLL_SERVICE_URL=http://localhost:8082
REACT_APP_VOTE_SERVICE_URL=http://localhost:8083
REACT_APP_ANALYTICS_SERVICE_URL=http://localhost:8084
REACT_APP_REALTIME_SERVICE_URL=http://localhost:3001
```

## Tech Stack

- React 18
- React Router v6
- Axios (HTTP client)
- Socket.IO client (WebSocket)
- Chart.js + react-chartjs-2 (charts)
