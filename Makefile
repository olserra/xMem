# Makefile for unified local dev and traceability

.PHONY: up down logs ps

# Start the full dev stack (Next.js, ML backend, Postgres)
up:
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