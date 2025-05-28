import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/backend/orchestrator';
import type { LLMProvider } from '@/backend/xmem';

interface AgentChatRequest {
  model: string;
  sources: string[];
  history: { role: string; content: string }[];
  user_input: string;
}

interface AgentChatResponse {
  reply: string;
  metadata: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AgentChatRequest;
    // Use OllamaAdapter via orchestrator to generate a response
    const context = { history: body.history, sources: body.sources };
    const llmProvider = orchestrator.getProvider<LLMProvider>('llm');
    const reply = await llmProvider.generateResponse(body.user_input, context);

    // Store conversation memory in ChromaDB (default vector provider)
    // Use a sessionId based on sources or user (for demo, use sources[0] or 'default')
    const sessionId = body.sources[0] || 'default';
    // Store user message
    await orchestrator.addMemory({
      id: `${sessionId}-user-${Date.now()}`,
      text: body.user_input,
      metadata: { role: 'user' },
      sessionId,
    });
    // Store agent reply
    await orchestrator.addMemory({
      id: `${sessionId}-agent-${Date.now()}`,
      text: reply,
      metadata: { role: 'agent' },
      sessionId,
    });

    const response: AgentChatResponse = {
      reply,
      metadata: { model: body.model },
    };
    return NextResponse.json(response);
  } catch (e) {
    console.error('Agent chat error:', e);
    return NextResponse.json({ error: 'Invalid request', details: String(e) }, { status: 400 });
  }
} 