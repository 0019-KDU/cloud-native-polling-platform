# =========================
# 1. Build Stage
# =========================
FROM node:18.20.4-alpine3.20 AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./

RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build-time environment variables (React needs build-time injection)
ARG REACT_APP_AUTH_SERVICE_URL
ARG REACT_APP_POLL_SERVICE_URL
ARG REACT_APP_VOTE_SERVICE_URL
ARG REACT_APP_ANALYTICS_SERVICE_URL
ARG REACT_APP_REALTIME_SERVICE_URL

ENV REACT_APP_AUTH_SERVICE_URL=${REACT_APP_AUTH_SERVICE_URL} \
    REACT_APP_POLL_SERVICE_URL=${REACT_APP_POLL_SERVICE_URL} \
    REACT_APP_VOTE_SERVICE_URL=${REACT_APP_VOTE_SERVICE_URL} \
    REACT_APP_ANALYTICS_SERVICE_URL=${REACT_APP_ANALYTICS_SERVICE_URL} \
    REACT_APP_REALTIME_SERVICE_URL=${REACT_APP_REALTIME_SERVICE_URL}

# Build React app
RUN npm run build


# =========================
# 2. Production Stage
# =========================
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="frontend" \
      org.opencontainers.image.description="React frontend for PollStream" \
      org.opencontainers.image.version="1.0.0"

# Remove default nginx website (clean setup)
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --chown=nginx:nginx --from=builder /app/build /usr/share/nginx/html

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck (use wget which exists in alpine nginx OR switch to curl if added)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]