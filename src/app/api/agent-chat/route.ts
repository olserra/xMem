import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/backend/orchestrator';
import type { LLMProvider } from '@/backend/xmem';
import { OpenAIAdapter } from '@/backend/adapters/openai';
import { prisma } from '../../../../prisma/prisma';
import { QdrantAdapter } from '@/backend/adapters/qdrant';
import { ChromaDBAdapter } from '@/backend/adapters/chromadb';
import { PineconeAdapter } from '@/backend/adapters/pinecone';
import { MongoDBVectorAdapter } from '@/backend/adapters/mongodb';
import { HuggingFaceEmbeddingService } from '@/backend/embeddingService';

interface AgentChatRequest {
  model: string;
  sources: string[];
  history: { role: string; content: string }[];
  user_input: string;
  chatMemoryVectorProvider?: string;
  collection?: string;
}

interface AgentChatResponse {
  reply: string;
  metadata: Record<string, unknown>;
}

// System prompt to restrict the agent
const SYSTEM_PROMPT = `You are an AI agent for xmem. Only answer questions using the provided context from the connected data sources. If the answer is not in the context, say you don't know. Keep answers short. Only answer questions about xmem, its data, or its business model. Do not answer unrelated or random questions.`;

// Register OpenRouter provider if not already registered
if (
  process.env.OPENROUTER_API_URL &&
  process.env.OPENROUTER_API_KEY &&
  process.env.OPENROUTER_MODEL
) {
  orchestrator.registerProvider('llm', 'openrouter', new OpenAIAdapter({
    apiUrl: process.env.OPENROUTER_API_URL,
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL,
  }));
  orchestrator.setDefaultProvider('llm', 'openrouter');
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AgentChatRequest;
    // Look up all selected sources
    const sourceIds = body.sources || [];
    const memorySources = sourceIds.length > 0
      ? await prisma.memorySource.findMany({ where: { id: { in: sourceIds } } })
      : [];
    console.log('Selected memorySources:', memorySources);
    // Optionally, use a sessionId (could be user/session based, here just a static string for demo)
    const sessionId = 'agent-session';
    // Retrieve relevant context from all selected sources
    let contextResults: any[] = [];
    const embeddingService = new HuggingFaceEmbeddingService();
    try {
      const embedding = await embeddingService.embed(body.user_input);
      const allResults = await Promise.all(
        memorySources.map(async (source) => {
          if (source.type === 'qdrant') {
            const adapter = new QdrantAdapter({
              url: source.vectorDbUrl,
              collection: source.collection,
              apiKey: source.apiKey,
            });
            const results = await adapter.searchEmbedding(embedding, 5);
            console.log(`[Qdrant] searchEmbedding results for source ${source.id}:`, results);
            return results;
          } else if (source.type === 'chromadb') {
            const adapter = new ChromaDBAdapter({
              url: source.vectorDbUrl,
              collection: source.collection,
              apiKey: source.apiKey,
            });
            const results = await adapter.searchEmbedding(embedding, 5);
            console.log(`[ChromaDB] searchEmbedding results for source ${source.id}:`, results);
            return results;
          } else if (source.type === 'pinecone') {
            const adapter = new PineconeAdapter({
              apiKey: source.apiKey,
              environment: source.vectorDbUrl, // Assuming env is stored here
              indexName: source.collection,
              projectId: undefined, // Add if you store it
            });
            const results = await adapter.searchEmbedding(embedding, 5);
            console.log(`[Pinecone] searchEmbedding results for source ${source.id}:`, results);
            return results;
          } else if (source.type === 'mongodb') {
            const adapter = new MongoDBVectorAdapter({
              uri: source.vectorDbUrl,
              dbName: source.metric || 'xmem',
              collectionName: source.collection,
            });
            const results = await adapter.searchEmbedding(embedding, 5);
            console.log(`[MongoDB] searchEmbedding results for source ${source.id}:`, results);
            return results;
          } else {
            // Fallback: use orchestrator (may not work for custom sources)
            const results = await orchestrator.semanticSearch(body.user_input, {
              vectorProvider: source.type,
              topK: 5,
              collection: source.collection,
            });
            console.log(`[Orchestrator fallback] searchEmbedding results for source ${source.id}:`, results);
            return results;
          }
        })
      );
      // Flatten and merge all results
      contextResults = allResults.flat();
      console.log('Aggregated contextResults:', contextResults);
      if (!contextResults || contextResults.length === 0) {
        console.warn('No context results found for the query!');
      }
    } catch (err) {
      contextResults = [];
    }
    // Build a context string from the retrieved results
    const contextText = contextResults.length > 0
      ? contextResults.map((item, i) => `Context ${i + 1}: ${typeof item === 'string' ? item : JSON.stringify(item)}`).join('\n')
      : '';
    console.log('Final contextText for LLM:', contextText);
    // Compose the prompt for the LLM
    const prompt = [
      SYSTEM_PROMPT,
      contextText ? `\nContext:\n${contextText}` : '',
      `\nUser: ${body.user_input}`,
      'Agent:'
    ].join('\n');
    console.log('Final prompt sent to LLM:', prompt);
    // Use the orchestrator's LLM provider (Ollama, Llama, etc.)
    // Map frontend model to backend provider name
    let llmProvider: string | undefined = undefined;
    if (process.env.OPENROUTER_API_URL && process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_MODEL) {
      llmProvider = 'openrouter';
    } else if (body.model && ['ollama', 'llama', 'llamacpp', 'mistral', 'huggingface', 'openai', 'gemini'].includes(body.model)) {
      llmProvider = body.model;
    } else {
      llmProvider = 'ollama'; // Default fallback
    }
    const llm = orchestrator.getProvider<LLMProvider>('llm', llmProvider);
    const reply = await llm.generateResponse(prompt);
    const response: AgentChatResponse = {
      reply,
      metadata: { model: llmProvider, sources: sourceIds, contextCount: contextResults.length },
    };
    return NextResponse.json(response);
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error('Agent chat error:', errMsg);
    return NextResponse.json({ error: 'Invalid request', details: errMsg }, { status: 400 });
  }
} 