-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Convert the embedding column to vector type
ALTER TABLE "Data" 
ALTER COLUMN embedding TYPE vector(384) 
USING embedding::vector(384);

-- Create a function for cosine similarity search
CREATE OR REPLACE FUNCTION cosine_similarity(a vector, b vector)
RETURNS float
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN 1 - (a <=> b);
END;
$$;

-- Create an index for faster similarity search
CREATE INDEX IF NOT EXISTS data_embedding_idx ON "Data" USING ivfflat (embedding vector_cosine_ops); 