import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/backend/orchestrator';
import type { LLMProvider } from '@/backend/xmem';
import { OpenAIAdapter } from '@/backend/adapters/openai';

interface AgentChatRequest {
  model: string;
  sources: string[];
  history: { role: string; content: string }[];
  user_input: string;
  chatMemoryVectorProvider?: string;
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
    // Use the selected vector provider (from chatMemoryVectorProvider or sources[0])
    const vectorProvider = body.chatMemoryVectorProvider || body.sources?.[0] || undefined;
    // Optionally, use a sessionId (could be user/session based, here just a static string for demo)
    const sessionId = 'agent-session';
    // Retrieve relevant context from the selected vector DB
    let contextResults: any[] = [];
    try {
      const results = await orchestrator.semanticSearch(body.user_input, {
        vectorProvider,
        topK: 5,
      });
      contextResults = Array.isArray(results) ? results : [];
    } catch (err) {
      contextResults = [];
    }
    // Build a context string from the retrieved results
    const contextText = contextResults.length > 0
      ? contextResults.map((item, i) => `Context ${i + 1}: ${typeof item === 'string' ? item : JSON.stringify(item)}`).join('\n')
      : '';
    // Compose the prompt for the LLM
    const prompt = [
      SYSTEM_PROMPT,
      contextText ? `\nContext:\n${contextText}` : '',
      `\nUser: ${body.user_input}`,
      'Agent:'
    ].join('\n');
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
      metadata: { model: llmProvider, vectorProvider, contextCount: contextResults.length },
    };
    return NextResponse.json(response);
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error('Agent chat error:', errMsg);
    return NextResponse.json({ error: 'Invalid request', details: errMsg }, { status: 400 });
  }
} 