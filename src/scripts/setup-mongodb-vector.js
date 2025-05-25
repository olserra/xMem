import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'xmem';
const collectionName = process.env.MONGODB_COLLECTION || 'vectors';
const vectorField = 'embedding';
const dimensions = 3; // Change to your embedding size for production
const similarity = 'cosine';
const numDocs = 50;

function randomVector(dim) {
  return Array.from({ length: dim }, () => Math.random());
}

function randomPhrase() {
  const phrases = [
    "apple pie", "banana split", "carrot cake", "date shake", "elderberry jam", "fig tart", "grape soda", "honeydew smoothie", "kiwi sorbet", "lemon curd", "mango salsa", "nectarine crisp", "orange marmalade", "papaya salad", "quince jelly", "raspberry mousse", "strawberry shortcake", "tomato soup", "ugli fruit punch", "vanilla pudding", "watermelon slush", "xigua salad", "yam fries", "zucchini bread"
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);
  // Drop and recreate collection
  await db.collection(collectionName).drop().catch(() => {});
  await db.createCollection(collectionName);
  await db.collection(collectionName).createIndex({ [vectorField]: '2dsphere' });
  // Insert mock data
  const docs = Array.from({ length: numDocs }, (_, i) => {
    const phrase = randomPhrase();
    return {
      embedding: randomVector(dimensions),
      text: phrase,
      source: phrase,
      score: Math.floor(Math.random() * 100),
      size: phrase.length,
      flag: Math.random() < 0.5
    };
  });
  await db.collection(collectionName).insertMany(docs);
  console.log('Inserted mock data into MongoDB vector collection.');
} catch (err) {
  console.error('MongoDB vector setup error:', err);
  process.exit(1);
} finally {
  await client.close();
} 