# ── Backend Dockerfile ──────────────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

# System deps for psycopg2 (PostgreSQL driver)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (cached layer — only rebuilds if requirements change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY app/ ./app/

# Cloud Run sets PORT env var; default 8080
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start server
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1"]
