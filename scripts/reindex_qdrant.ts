import { HuggingFaceEmbeddingService } from '../src/backend/embeddingService';
import { QdrantAdapter } from '../src/backend/adapters/qdrant';

const QDRANT_URL = process.env.QDRANT_URL!;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY!;
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION!;

if (!QDRANT_URL || !QDRANT_API_KEY || !QDRANT_COLLECTION) {
  throw new Error('QDRANT_URL, QDRANT_API_KEY, and QDRANT_COLLECTION must be set in env');
}

async function fetchAllQdrantPoints() {
  const res = await fetch(`${QDRANT_URL.replace(/\/$/, '')}/collections/${QDRANT_COLLECTION}/points/scroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': QDRANT_API_KEY,
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to fetch Qdrant points: ' + res.status);
  const json = await res.json();
  return (json.result && json.result.points) || [];
}

async function main() {
  const embeddingService = new HuggingFaceEmbeddingService();
  const adapter = new QdrantAdapter({ url: QDRANT_URL, collection: QDRANT_COLLECTION, apiKey: QDRANT_API_KEY });
  const points = await fetchAllQdrantPoints();
  console.log(`Fetched ${points.length} points from Qdrant.`);
  for (const point of points) {
    const text = point.payload?.text;
    if (!text) {
      console.warn(`Skipping point ${point.id}: no text field in payload.`);
      continue;
    }
    const embedding = await embeddingService.embed(text);
    await adapter.addEmbedding({ id: point.id, embedding, metadata: point.payload });
    console.log(`Re-indexed point ${point.id}`);
  }
  console.log('Re-indexing complete.');
}

main().catch(err => {
  console.error('Re-indexing error:', err);
  process.exit(1);
}); 