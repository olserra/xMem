import { HuggingFaceEmbeddingService } from '../src/backend/embeddingService';
import { QdrantAdapter } from '../src/backend/adapters/qdrant';
import { PineconeAdapter } from '../src/backend/adapters/pinecone';

const QDRANT_URL = process.env.QDRANT_URL!;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY!;
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION!;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY!;
const PINECONE_HOST = process.env.PINECONE_HOST!;
const PINECONE_INDEX = process.env.PINECONE_INDEX!;

const NUM_POINTS = parseInt(process.env.NUM_POINTS || '200', 10);
const BATCH_SIZE = 50;

if (!QDRANT_URL || !QDRANT_API_KEY || !QDRANT_COLLECTION) throw new Error('QDRANT env vars missing');
if (!PINECONE_API_KEY || !PINECONE_HOST || !PINECONE_INDEX) throw new Error('PINECONE env vars missing');

async function deleteQdrantCollection() {
  const res = await fetch(`${QDRANT_URL.replace(/\/$/, '')}/collections/${QDRANT_COLLECTION}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'api-key': QDRANT_API_KEY,
    },
  });
  if (!res.ok) throw new Error('Failed to delete Qdrant collection: ' + res.status);
  // Recreate collection with correct vector size
  const createRes = await fetch(`${QDRANT_URL.replace(/\/$/, '')}/collections/${QDRANT_COLLECTION}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'api-key': QDRANT_API_KEY,
    },
    body: JSON.stringify({ vectors: { size: 384, distance: 'Cosine' } }),
  });
  if (!createRes.ok) throw new Error('Failed to create Qdrant collection: ' + createRes.status);
}

async function deleteAllPineconeVectors() {
  const endpoint = `${PINECONE_HOST.startsWith('http') ? PINECONE_HOST : `https://${PINECONE_HOST}`}/vectors/delete`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Api-Key': PINECONE_API_KEY,
  };
  // Delete all vectors by passing deleteAll: true
  const body = JSON.stringify({ deleteAll: true });
  const res = await fetch(endpoint, { method: 'POST', headers, body });
  if (!res.ok) throw new Error('Failed to delete all Pinecone vectors: ' + res.status);
}

function randomRocheText() {
  const trials = ["NCT123456", "NCT654321", "NCT111222", "NCT333444", "NCT555666"];
  const drugs = ["Drug X", "Drug Y", "Drug Z", "RocheMed-1", "RocheMed-2"];
  const events = [
    "Patient enrolled in clinical trial",
    "Patient discontinued due to adverse event",
    "Lab result: Hemoglobin 13.2 g/dL, normal range.",
    "Adverse event reported: mild headache after dose 2.",
    "Research paper: Efficacy of Drug Y in oncology.",
    "Protocol amendment submitted.",
    "Patient completed study.",
    "Serious adverse event: neutropenia grade 3.",
    "Patient received first dose of",
    "Patient randomized to treatment arm B."
  ];
  const trial = trials[Math.floor(Math.random() * trials.length)];
  const drug = drugs[Math.floor(Math.random() * drugs.length)];
  let event = events[Math.floor(Math.random() * events.length)];
  if (event.includes('trial')) event += ` ${trial}.`;
  if (event.includes('dose') || event.includes('received')) event += ` ${drug}.`;
  if (event.includes('Efficacy')) event += ` ${drug}.`;
  return event;
}

function randomMetadata(i: number) {
  return {
    text: randomRocheText(),
    source: ["Clinical Trial Database", "Drug Information", "Lab Results", "Research Paper", "Patient Record"][i % 5],
    score: Math.round(Math.random() * 100) / 100,
    size: Math.floor(Math.random() * 10) + 5,
    flag: Math.random() < 0.5,
    patientId: `PAT${1000 + i}`,
    trialId: ["NCT123456", "NCT654321", "NCT111222", "NCT333444", "NCT555666"][i % 5],
    drug: ["Drug X", "Drug Y", "Drug Z", "RocheMed-1", "RocheMed-2"][i % 5],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 1e10)).toISOString(),
  };
}

async function main() {
  console.log('Deleting Qdrant collection and Pinecone vectors...');
  await deleteQdrantCollection();
  await deleteAllPineconeVectors();
  console.log('Deleted old data. Proceeding with upsert...');
  const embeddingService = new HuggingFaceEmbeddingService();
  const qdrant = new QdrantAdapter({ url: QDRANT_URL, collection: QDRANT_COLLECTION, apiKey: QDRANT_API_KEY });
  const pinecone = new PineconeAdapter({ apiKey: PINECONE_API_KEY, environment: PINECONE_HOST, indexName: PINECONE_INDEX });
  const points = Array.from({ length: NUM_POINTS }, (_, i) => randomMetadata(i));
  console.log(`Generated ${NUM_POINTS} Roche-like points.`);
  for (let i = 0; i < points.length; i += BATCH_SIZE) {
    const batch = points.slice(i, i + BATCH_SIZE);
    const embeddings = await Promise.all(batch.map(pt => embeddingService.embed(pt.text)));
    // Qdrant (numeric IDs)
    await Promise.all(batch.map((pt, j) =>
      qdrant.addEmbedding({ id: i + j + 1, embedding: embeddings[j], metadata: pt })
    ));
    // Pinecone (string IDs)
    await Promise.all(batch.map((pt, j) =>
      pinecone.addEmbedding({ id: String(i + j + 1), embedding: embeddings[j], metadata: pt })
    ));
    console.log(`Upserted batch ${i / BATCH_SIZE + 1} (${i + 1}-${i + batch.length})`);
  }
  console.log('Bulk upsert complete.');
}

main().catch(err => {
  console.error('Bulk upsert error:', err);
  process.exit(1);
}); 