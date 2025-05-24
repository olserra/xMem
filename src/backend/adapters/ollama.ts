import { LLMProvider } from '../xmem';

type OllamaConfig = {
  apiUrl: string;
  model: string;
};

export class OllamaAdapter implements LLMProvider {
  private apiUrl: string;
  private model: string;

  constructor(config: OllamaConfig) {
    this.apiUrl = config.apiUrl;
    this.model = config.model;
  }

  async generateResponse(prompt: string, context?: Record<string, unknown>): Promise<string> {
    const res = await fetch(`${this.apiUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        context
      })
    });
    const json = await res.json();
    return json.response || '';
  }

  async embed(text: string, model?: string): Promise<number[]> {
    const res = await fetch(`${this.apiUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || this.model,
        prompt: text
      })
    });
    const json = await res.json();
    return json.embedding || [];
  }
} 