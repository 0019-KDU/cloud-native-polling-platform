FROM node:18.20.4-alpine3.20 AS builder
LABEL org.opencontainers.image.title="frontend" \
      org.opencontainers.image.description="React frontend for PollStream" \
      org.opencontainers.image.version="1.0.0"
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG REACT_APP_AUTH_SERVICE_URL
ARG REACT_APP_POLL_SERVICE_URL
ARG REACT_APP_VOTE_SERVICE_URL
ARG REACT_APP_ANALYTICS_SERVICE_URL
ARG REACT_APP_REALTIME_SERVICE_URL

ENV REACT_APP_AUTH_SERVICE_URL=$REACT_APP_AUTH_SERVICE_URL \
    REACT_APP_POLL_SERVICE_URL=$REACT_APP_POLL_SERVICE_URL \
    REACT_APP_VOTE_SERVICE_URL=$REACT_APP_VOTE_SERVICE_URL \
    REACT_APP_ANALYTICS_SERVICE_URL=$REACT_APP_ANALYTICS_SERVICE_URL \
    REACT_APP_REALTIME_SERVICE_URL=$REACT_APP_REALTIME_SERVICE_URL

RUN npm run build

FROM nginx:1.27-alpine
LABEL org.opencontainers.image.title="frontend" \
      org.opencontainers.image.description="React frontend for PollStream" \
      org.opencontainers.image.version="1.0.0"
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
