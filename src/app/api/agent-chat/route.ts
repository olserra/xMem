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
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';

interface AgentChatRequest {
  model: string;
  sources: string[];
  history: { role: string; content: string }[];
  user_input: string;
  chatMemoryVectorProvider?: string;
  collection?: string;
  userGoal?: string;
  preferences?: Record<string, unknown>;
  lastAction?: string;
  sessions?: string[];
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
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id || 'demo-user';
    const body = (await req.json()) as AgentChatRequest;
    // Use a sessionId from the request or fallback
    const sessionId = body.collection || null;

    // --- Load selected session messages (for context) ---
    let sessionsContext = '';
    let injectedMsgIds: string[] = [];
    let injectedSummary = '';
    if (body.sessions && Array.isArray(body.sessions) && body.sessions.length > 0) {
      const embeddingService = new HuggingFaceEmbeddingService();
      const userEmbedding = await embeddingService.embed(body.user_input);
      for (const sid of body.sessions) {
        // Fetch summary
        const sessionMemory = await prisma.sessionMemory.findUnique({ where: { sessionId: sid } });
        if (sessionMemory?.summary) {
          sessionsContext += `Session ${sid} Summary:\n${sessionMemory.summary}\n`;
          injectedSummary += sessionMemory.summary + '\n';
        }
        // Fetch pinned messages
        const pinned = await prisma.sessionMessage.findMany({
          where: { sessionId: sid, pinned: true, deleted: false },
          orderBy: { createdAt: 'asc' },
        });
        // Semantic search over messages
        const allMessages = await prisma.sessionMessage.findMany({
          where: { sessionId: sid, deleted: false },
        });
        // Compute similarity for each message
        const scored = await Promise.all(allMessages.map(async (msg) => {
          if (!msg.embedding || msg.embedding.length === 0) return { msg, score: -Infinity };
          // Cosine similarity
          const dot = msg.embedding.reduce((acc, v, i) => acc + v * userEmbedding[i], 0);
          const normA = Math.sqrt(msg.embedding.reduce((acc, v) => acc + v * v, 0));
          const normB = Math.sqrt(userEmbedding.reduce((acc, v) => acc + v * v, 0));
          const score = dot / (normA * normB);
          return { msg, score };
        }));
        const topRelevant = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 5).map(s => s.msg);
        // Inject pinned and top relevant messages
        const injected = [...pinned, ...topRelevant.filter(m => !pinned.find(p => p.id === m.id))];
        injectedMsgIds.push(...injected.map(m => m.id));
        sessionsContext += injected.map(m => `[${m.role}] ${m.content}`).join('\n');
      }
    }

    // --- Log context injection ---
    if (body.sessions && body.sessions.length > 0) {
      await prisma.contextInjectionLog.create({
        data: {
          userId,
          sessionId: sessionId || '',
          query: body.user_input,
          injectedMsgIds: injectedMsgIds.join(','),
          injectedSummary,
          injectedVectorIds: (body.sources || []).join(','),
        },
      });
    }

    // --- Build context for LLM ---
    const contextText =
      (sessionsContext ? `Relevant Sessions:\n${sessionsContext}\n\n` : '') +
      `User: ${body.user_input}`;

    // Look up all selected sources
    const sourceIds = body.sources || [];
    const memorySources = sourceIds.length > 0
      ? await prisma.memorySource.findMany({ where: { id: { in: sourceIds } } })
      : [];
    console.log('Selected memorySources:', memorySources);
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
    const contextTextFromResults = contextResults.length > 0
      ? contextResults.map((item, i) => `Context ${i + 1}: ${typeof item === 'string' ? item : JSON.stringify(item)}`).join('\n')
      : '';
    console.log('Final contextText for LLM:', contextTextFromResults);
    // Compose the prompt for the LLM
    const finalPrompt = [
      SYSTEM_PROMPT,
      sessionsContext ? `Relevant Sessions:\n${sessionsContext}\n` : '',
      contextTextFromResults ? `Context:\n${contextTextFromResults}\n` : '',
      `User: ${body.user_input}`,
      'Agent:'
    ].join('\n');
    console.log('Final prompt sent to LLM:', finalPrompt);
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
    const reply = await llm.generateResponse(finalPrompt);

    // --- Update session memory with agent reply ---
    if (sessionId) {
      const sessionMemory = await prisma.sessionMemory.findUnique({ where: { sessionId } });
      if (sessionMemory) {
        await prisma.sessionMemory.update({
          where: { sessionId },
          data: {
            summary: reply,
          },
        });
      } else {
        await prisma.sessionMemory.create({
          data: {
            userId,
            sessionId,
            summary: reply,
          },
        });
      }
    }

    const response: AgentChatResponse = {
      reply,
      metadata: { model: llmProvider, sessionMemory: { summary: reply } },
    };
    return NextResponse.json(response);
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error('Agent chat error:', errMsg);
    return NextResponse.json({ error: 'Invalid request', details: errMsg }, { status: 400 });
  }
} 