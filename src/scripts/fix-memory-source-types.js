const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function detectType(url) {
  if (!url) return 'qdrant';
  const u = url.toLowerCase();
  if (u.includes('qdrant')) return 'qdrant';
  if (u.includes('pinecone')) return 'pinecone';
  if (u.includes('mongodb')) return 'mongodb';
  if (u.includes('chroma')) return 'chromadb';
  return 'qdrant';
}

async function main() {
  const sources = await prisma.memorySource.findMany({ where: { type: 'vectorDb' } });
  for (const source of sources) {
    const newType = detectType(source.vectorDbUrl);
    await prisma.memorySource.update({
      where: { id: source.id },
      data: { type: newType },
    });
    console.log(`Updated source ${source.id}: type 'vectorDb' -> '${newType}'`);
  }
  console.log('Done.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); }); 