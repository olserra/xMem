# Makefile for unified local dev and traceability

.PHONY: up down logs ps lock

# Regenerate poetry.lock for ml_service in a Python 3.11 container
lock:
	docker run --rm -v "$(PWD)/ml_service":/app -w /app python:3.11-slim /bin/bash -c "pip install poetry && poetry lock"

# Start the full dev stack (Next.js, ML backend, Postgres)
up: lock
	docker compose -f docker-compose.dev.yml up --build

# Stop all running containers
# (useful for cleaning up after dev)
down:
	docker compose -f docker-compose.dev.yml down

# Show logs for all services (follow mode)
logs:
	docker compose -f docker-compose.dev.yml logs -f

# Show status of all services
ps:
	docker compose -f docker-compose.dev.yml ps

# Usage:
#   make up    # start everything (dev mode, hot reload)
#   make down  # stop everything
#   make logs  # follow logs for all services
#   make ps    # show status of all services 