# XMem Backend Service

This is the Python/FastAPI backend service for XMem, handling data processing, ML operations, and complex business logic.

## Setup

1. Install Poetry (Python package manager):
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Install dependencies:
```bash
poetry install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Initialize the database:
```bash
poetry run alembic upgrade head
```

5. Run the development server:
```bash
poetry run uvicorn app.main:app --reload
```

## Project Structure

```
backend/
├── alembic/              # Database migrations
├── app/
│   ├── api/             # API endpoints
│   ├── core/            # Core functionality
│   ├── db/              # Database models and config
│   ├── ml/              # Machine learning models
│   ├── schemas/         # Pydantic models
│   └── services/        # Business logic
├── tests/               # Test files
├── .env                 # Environment variables
├── .env.example         # Example environment variables
└── pyproject.toml       # Project dependencies
```

## API Documentation

Once the server is running, you can access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT token expiration
- `NEXTAUTH_URL`: Next.js auth URL
- `NEXTAUTH_SECRET`: Next.js auth secret 