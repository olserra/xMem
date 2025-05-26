FROM python:3.11-slim
WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy only the dependency files first for better caching
COPY pyproject.toml poetry.lock ./

# Install dependencies using Poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy the rest of the application
COPY . .

EXPOSE 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"] 