import { LLMProvider } from '../xmem';

type LlamaCppConfig = {
  apiUrl: string;
};

export class LlamaCppAdapter implements LLMProvider {
  private apiUrl: string;

  constructor(config: LlamaCppConfig) {
    this.apiUrl = config.apiUrl;
  }

  async generateResponse(prompt: string, context?: Record<string, unknown>): Promise<string> {
    const res = await fetch(`${this.apiUrl}/completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context })
    });
    const json = await res.json();
    return json.content || json.response || '';
  }

  async embed(text: string, model?: string): Promise<number[]> {
    const body: Record<string, unknown> = { content: text };
    if (model) body.model = model;
    const res = await fetch(`${this.apiUrl}/embedding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    return json.embedding || [];
  }
} 