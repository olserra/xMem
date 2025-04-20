# Frontend Development Stage
FROM node:18-alpine AS frontend-dev

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.7.1 --activate

# Copy frontend package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Expose Next.js port
EXPOSE 3000

# Start the development server
CMD ["pnpm", "run", "dev"]

# Frontend Production Build Stage
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.7.1 --activate

# Copy frontend files
COPY package.json pnpm-lock.yaml* ./
COPY . .

# Install dependencies and build
RUN pnpm install && pnpm run build

# Backend Development Stage
FROM python:3.9-slim AS backend-dev

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_HOME=/opt/poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy backend files
COPY backend/pyproject.toml backend/poetry.lock* ./

# Install dependencies
RUN poetry install --no-root --no-interaction --no-ansi

# Copy application code
COPY backend/ .

# Create necessary directories
RUN mkdir -p /app/logs

# Expose FastAPI port
EXPOSE 8000

# Run migrations and start the application
CMD poetry run alembic upgrade head && \
    poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Backend Production Stage
FROM python:3.9-slim AS backend-prod

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_HOME=/opt/poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy backend files
COPY backend/pyproject.toml backend/poetry.lock* ./

# Install dependencies
RUN poetry install --no-root --no-interaction --no-ansi --only main

# Copy application code
COPY backend/ .

# Create necessary directories
RUN mkdir -p /app/logs

# Expose FastAPI port
EXPOSE 8000

# Run migrations and start the application
CMD poetry run alembic upgrade head && \
    poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 