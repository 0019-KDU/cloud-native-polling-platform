FROM python:3.11.9-slim
LABEL org.opencontainers.image.title="analytics-service" \
      org.opencontainers.image.description="Analytics service for PollStream" \
      org.opencontainers.image.version="1.0.0"
WORKDIR /app
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
COPY --chown=appuser:appgroup requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --chown=appuser:appgroup app ./app
COPY --chown=appuser:appgroup main.py .
USER appuser
EXPOSE 8084
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8084/health')" || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8084"]
