const { MongoClient } = require('mongodb');

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

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // Drop collection if it exists
    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length > 0) {
      await db.collection(collectionName).drop();
      console.log(`Collection "${collectionName}" dropped.`);
    }

    // Create collection
    await db.createCollection(collectionName);
    console.log(`Collection "${collectionName}" created.`);

    // Create vector index
    await db.collection(collectionName).createIndex(
      { [vectorField]: "vector" },
      {
        name: "embedding_vector_index",
        dimensions,
        similarity
      }
    );
    console.log(`Vector index created on "${vectorField}" with ${dimensions} dimensions and "${similarity}" similarity.`);

    // Insert mock data
    const docs = Array.from({ length: numDocs }, (_, i) => {
      const phrase = randomPhrase();
      return {
        _id: i + 1,
        [vectorField]: randomVector(dimensions),
        text: phrase,
        source: phrase,
        score: Math.floor(Math.random() * 100),
        size: phrase.length,
        flag: Math.random() < 0.5
      };
    });
    await db.collection(collectionName).insertMany(docs);
    console.log(`${numDocs} mock documents inserted.`);
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 