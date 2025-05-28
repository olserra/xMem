import { NextRequest, NextResponse } from 'next/server';

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
    // TODO: Integrate with orchestrator, LLM, and vector DBs as needed
    const reply = `[${body.model}] You said: ${body.user_input} (sources: ${body.sources.join(', ')})`;
    const response: AgentChatResponse = {
      reply,
      metadata: { model: body.model },
    };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 