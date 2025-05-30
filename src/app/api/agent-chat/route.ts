import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/backend/orchestrator';

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

const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL!;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL!;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AgentChatRequest;
    // Convert chat history to OpenAI format
    const messages = [
      ...body.history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: body.user_input }
    ];
    // Call OpenRouter API (no API key required for free models)
    const orRes = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages
      })
    });
    if (!orRes.ok) {
      const errText = await orRes.text();
      throw new Error(`OpenRouter API error: ${orRes.status} ${errText}`);
    }
    const orJson = await orRes.json();
    const reply = orJson.choices?.[0]?.message?.content || '';

    const response: AgentChatResponse = {
      reply,
      metadata: { model: OPENROUTER_MODEL },
    };
    return NextResponse.json(response);
  } catch (e) {
    console.error('Agent chat error:', e);
    return NextResponse.json({ error: 'Invalid request', details: String(e) }, { status: 400 });
  }
} 