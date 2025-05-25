import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.PINECONE_API_KEY;
const host = process.env.PINECONE_HOST;
const indexName = process.env.PINECONE_INDEX;
const VECTOR_DIM = 1024;
const NUM_VECTORS = 100;

if (!apiKey || !host || !indexName) {
  console.error('Missing Pinecone env vars: PINECONE_API_KEY, PINECONE_HOST, PINECONE_INDEX');
  process.exit(1);
}

const endpoint = `https://${host}/vectors/upsert`;

function randomVector(dim) {
  return Array.from({ length: dim }, () => Math.random());
}

function randomPhrase() {
  const phrases = [
    "apple pie", "banana split", "carrot cake", "date shake", "elderberry jam", "fig tart", "grape soda", "honeydew smoothie", "kiwi sorbet", "lemon curd", "mango salsa", "nectarine crisp", "orange marmalade", "papaya salad", "quince jelly", "raspberry mousse", "strawberry shortcake", "tomato soup", "ugli fruit punch", "vanilla pudding", "watermelon slush", "xigua salad", "yam fries", "zucchini bread"
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

const vectors = Array.from({ length: NUM_VECTORS }, (_, i) => {
  const phrase = randomPhrase();
  return {
    id: `mock-${i + 1}`,
    values: randomVector(VECTOR_DIM),
    metadata: {
      text: phrase,
      source: phrase,
      score: Math.floor(Math.random() * 100),
      size: phrase.length,
      flag: Math.random() < 0.5
    }
  };
});

const body = JSON.stringify({ vectors, namespace: 'default' });
const headers = {
  'Content-Type': 'application/json',
  'Api-Key': apiKey,
};

try {
  const res = await fetch(endpoint, { method: 'POST', headers, body });
  const text = await res.text();
  if (!res.ok) {
    console.error('Pinecone upsert failed:', res.status, text);
    process.exit(1);
  }
  console.log('Pinecone upsert result:', text);
} catch (err) {
  console.error('Error upserting to Pinecone:', err);
  process.exit(1);
} 