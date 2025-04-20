#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to load environment variables
load_env() {
    if [ -f .env.production ]; then
        echo -e "${BLUE}Loading environment variables from .env.production file...${NC}"
        export $(cat .env.production | grep -v '^#' | xargs)
    elif [ -f .env ]; then
        echo -e "${BLUE}Loading environment variables from .env file...${NC}"
        export $(cat .env | grep -v '^#' | xargs)
    else
        echo -e "${RED}No .env or .env.production file found. Please create one with the required environment variables.${NC}"
        exit 1
    fi
}

# Function to check Docker installation
check_docker() {
    echo -e "${BLUE}Checking Docker installation...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        echo -e "${RED}Docker daemon is not running. Please start Docker.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Docker is installed and running${NC}"
}

# Function to stop and remove existing containers
cleanup() {
    echo -e "${BLUE}Cleaning up existing containers...${NC}"
    docker rm -f xmem-postgres xmem-frontend xmem-n8n 2>/dev/null || true
    docker network rm xmem-network 2>/dev/null || true
}

# Function to start services
start_services() {
    echo -e "${BLUE}Starting services...${NC}"

    # Create network
    docker network create xmem-network 2>/dev/null || true

    # Run PostgreSQL
    echo -e "${BLUE}Starting PostgreSQL...${NC}"
    docker run -d \
        --name xmem-postgres \
        --network xmem-network \
        -e POSTGRES_USER=xmem_user \
        -e POSTGRES_PASSWORD=xmem_password \
        -e POSTGRES_DB=xmem_db \
        -v postgres_data:/var/lib/postgresql/data \
        -p 5432:5432 \
        postgres:15-alpine

    # Wait for PostgreSQL to be ready
    echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
    sleep 10

    # Run n8n
    echo -e "${BLUE}Starting n8n...${NC}"
    docker run -d \
        --name xmem-n8n \
        --network xmem-network \
        -e N8N_HOST=localhost \
        -e N8N_PROTOCOL=http \
        -e N8N_PORT=5678 \
        -e DB_TYPE=postgresdb \
        -e DB_POSTGRESDB_HOST=xmem-postgres \
        -e DB_POSTGRESDB_DATABASE=xmem_db \
        -e DB_POSTGRESDB_USER=xmem_user \
        -e DB_POSTGRESDB_PASSWORD=xmem_password \
        -p 5678:5678 \
        n8nio/n8n

    # Build and run frontend
    echo -e "${BLUE}Building and starting frontend...${NC}"
    docker build -t xmem-frontend ./frontend
    docker run -d \
        --name xmem-frontend \
        --network xmem-network \
        -v $(pwd)/frontend:/app \
        -v /app/node_modules \
        -v /app/.next \
        -p 3000:3000 \
        xmem-frontend
}

# Main execution
main() {
    echo -e "${BLUE}Starting development environment...${NC}"
    
    load_env
    check_docker
    cleanup
    start_services
    
    echo -e "\n${GREEN}Development environment is ready!${NC}"
    echo -e "\nAccess your services at:"
    echo -e "${BLUE}Frontend:${NC}    http://localhost:3000"
    echo -e "${BLUE}n8n:${NC}         http://localhost:5678"
    echo -e "${BLUE}PostgreSQL:${NC}   localhost:5432"
    
    echo -e "\n${YELLOW}To view logs, use:${NC}"
    echo "docker logs -f xmem-frontend"
    echo "docker logs -f xmem-n8n"
    echo "docker logs -f xmem-postgres"
    
    echo -e "\n${YELLOW}To stop all services:${NC}"
    echo "./scripts/dev.sh stop"
}

# Stop function
stop() {
    echo -e "${BLUE}Stopping all services...${NC}"
    cleanup
    echo -e "${GREEN}All services stopped${NC}"
}

# Script entry point
case "$1" in
    "stop")
        stop
        ;;
    *)
        main
        ;;
esac 