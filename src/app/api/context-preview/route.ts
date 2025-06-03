import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import { ContextPreviewRequest, ContextPreviewResult, ContextItem } from '../../dashboard/context/types';
import { QdrantAdapter } from '../../../backend/adapters/qdrant';
import { PineconeAdapter } from '../../../backend/adapters/pinecone';
import { ChromaDBAdapter } from '../../../backend/adapters/chromadb';
import { MongoDBVectorAdapter } from '../../../backend/adapters/mongodb';
import { HuggingFaceEmbeddingService } from '../../../backend/embeddingService';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await req.json()) as ContextPreviewRequest & { rankingFactors?: { similarity: number; recency: number; feedback: number } };
  const { projectId, sourceIds, collection, method, query, rankingFactors } = body;
  if (!projectId || !Array.isArray(sourceIds) || sourceIds.length === 0) {
    return NextResponse.json({ queries: [] });
  }

  // Fetch all selected sources for the user and project
  const sources = await prisma.memorySource.findMany({
    where: {
      id: { in: sourceIds },
    },
  });

  // Use real embedding for the query
  let embedding: number[] = [];
  if (query && query.trim().length > 0) {
    try {
      const embeddingService = new HuggingFaceEmbeddingService();
      embedding = await embeddingService.embed(query);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to generate embedding for query' }, { status: 500 });
    }
  } else {
    embedding = Array(384).fill(0); // fallback to dummy vector if no query
  }

  // For each source, run a semantic search (for now, just fetch top 10 items)
  let allResults: ContextItem[] = [];
  for (const source of sources) {
    let adapter;
    if (source.type === 'qdrant') {
      adapter = new QdrantAdapter({ url: source.vectorDbUrl, collection: source.collection, apiKey: source.apiKey });
    } else if (source.type === 'pinecone') {
      adapter = new PineconeAdapter({ apiKey: source.apiKey, environment: source.vectorDbUrl, indexName: source.collection });
    } else if (source.type === 'chromadb') {
      adapter = new ChromaDBAdapter({ url: source.vectorDbUrl, collection: source.collection, apiKey: source.apiKey });
    } else if (source.type === 'mongodb') {
      adapter = new MongoDBVectorAdapter({ uri: source.vectorDbUrl, dbName: source.metric || 'xmem', collectionName: source.collection });
    } else {
      continue;
    }
    try {
      const results = await adapter.searchEmbedding(embedding, 10);
      allResults.push(...results.map((item: any, i: number) => ({
        ...item,
        id: item.id || `${source.id}-${i}`,
        source: source.type,
        collection: source.collection,
        score: item.score || 0,
        recency: item.recency || 0,
        feedbackScore: item.feedbackScore || 0,
      })));
    } catch (e) {
      // Ignore errors for individual sources
    }
  }

  // Merge and rank results (simple sort by score, can be improved)
  let ranked = allResults;
  if (method === 'smart') {
    if (rankingFactors) {
      ranked = allResults.map(item => ({
        ...item,
        combinedScore:
          (item.score || 0) * rankingFactors.similarity +
          (item.recency || 0) * rankingFactors.recency +
          (item.feedbackScore || 0) * rankingFactors.feedback
      })).sort((a, b) => (b.combinedScore || 0) - (a.combinedScore || 0));
    } else {
      ranked = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
  } else if (method === 'recency') {
    ranked = allResults.sort((a, b) => (b.recency || 0) - (a.recency || 0));
  } else if (method === 'feedback') {
    ranked = allResults.sort((a, b) => (b.feedbackScore || 0) - (a.feedbackScore || 0));
  } else if (method === 'similarity') {
    ranked = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  // Return top N (e.g., 20) context items
  return NextResponse.json({ queries: ranked.slice(0, 20) } as ContextPreviewResult);
} 