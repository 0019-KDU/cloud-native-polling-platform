FROM node:18.20.4-alpine3.20
LABEL org.opencontainers.image.title="realtime-service" \
      org.opencontainers.image.description="WebSocket real-time service for PollStream" \
      org.opencontainers.image.version="1.0.0"
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --chown=appuser:appgroup package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY --chown=appuser:appgroup src ./src
USER appuser
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
CMD ["node", "src/index.js"]