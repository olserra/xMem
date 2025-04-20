#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check service health
check_service() {
    local service=$1
    local url=$2
    local max_attempts=$3
    local attempt=1

    echo "Checking $service..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" > /dev/null; then
            echo -e "${GREEN}✓${NC} $service is up"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts: $service not ready, waiting..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}✗${NC} $service failed to start"
    return 1
}

# Start services
echo "Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check each service
check_service "PostgreSQL" "http://localhost:5432" 6
check_service "Backend" "http://localhost:8000/health" 6
check_service "Frontend" "http://localhost:3000" 6
check_service "n8n" "http://localhost:5678" 6
check_service "Prometheus" "http://localhost:9090" 3
check_service "Grafana" "http://localhost:3001" 3
check_service "Loki" "http://localhost:3100/ready" 3

# Check if all services are running
echo "Checking container status..."
if [ "$(docker-compose ps -q | wc -l)" -eq "$(docker-compose config --services | wc -l)" ]; then
    echo -e "${GREEN}All services are running!${NC}"
else
    echo -e "${RED}Some services failed to start${NC}"
    docker-compose ps
    exit 1
fi

# Run basic API tests
echo "Running API tests..."
curl -s -f "http://localhost:8000/health" > /dev/null && \
    echo -e "${GREEN}✓${NC} Backend health check passed" || \
    (echo -e "${RED}✗${NC} Backend health check failed" && exit 1)

# Check monitoring
echo "Checking monitoring stack..."
curl -s -f "http://localhost:9090/-/healthy" > /dev/null && \
    echo -e "${GREEN}✓${NC} Prometheus health check passed" || \
    echo -e "${RED}✗${NC} Prometheus health check failed"

curl -s -f "http://localhost:3001/api/health" > /dev/null && \
    echo -e "${GREEN}✓${NC} Grafana health check passed" || \
    echo -e "${RED}✗${NC} Grafana health check failed"

# Show logs if any service failed
if [ $? -ne 0 ]; then
    echo "Showing logs for failed services..."
    docker-compose logs
    exit 1
fi

echo -e "${GREEN}All tests passed!${NC}" 