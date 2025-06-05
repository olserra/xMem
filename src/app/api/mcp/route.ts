import { NextRequest, NextResponse } from 'next/server';
import { XmemOrchestrator } from '@/backend/xmem';
import { MCPAdapter } from '@/backend/adapters/mcp';
import { MockVectorStore } from '@/backend/adapters/mockVectorStore';
import { WeaviateAdapter } from '@/backend/adapters/weaviate';
import { OllamaAdapter } from '@/backend/adapters/ollama';
import { OpenAIAdapter } from '@/backend/adapters/openai';

const orchestrator = new XmemOrchestrator();
// Register Weaviate as vector provider
orchestrator.registerProvider('vector', 'weaviate', new WeaviateAdapter({
  endpoint: process.env.WEAVIATE_ENDPOINT!,
  apiKey: process.env.WEAVIATE_API_KEY!,
  className: process.env.WEAVIATE_CLASS_NAME!,
}));
orchestrator.setDefaultProvider('vector', 'weaviate');
// Register OpenAI as LLM provider
orchestrator.registerProvider('llm', 'openrouter', new OpenAIAdapter({
  apiKey: process.env.OPENROUTER_API_KEY!,
  model: process.env.OPENROUTER_MODEL!,
  apiUrl: 'https://openrouter.ai/api/v1',
}));
orchestrator.setDefaultProvider('llm', 'openrouter');
const mcp = new MCPAdapter(orchestrator);

export async function POST(req: NextRequest) {
  try {
    const { action, context, query } = await req.json();
    let result;
    switch (action) {
      case 'store':
        result = await mcp.storeContext(context);
        break;
      case 'retrieve':
        result = await mcp.retrieveContext(query);
        break;
      case 'update':
        result = await mcp.updateContext(context);
        break;
      case 'delete':
        result = await mcp.deleteContext(context);
        break;
      default:
        return NextResponse.json({ error: 'Unsupported MCP action' }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: (err as Error).message }, { status: 400 });
  }
} 