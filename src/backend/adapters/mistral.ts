import { LLMProvider } from '../xmem';

type MistralConfig = {
  apiUrl: string;
  apiKey?: string;
};

export class MistralAdapter implements LLMProvider {
  private apiUrl: string;
  private apiKey?: string;

  constructor(config: MistralConfig) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
  }

  async generateResponse(prompt: string, context?: Record<string, unknown>): Promise<string> {
    const res = await fetch(`${this.apiUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify({ prompt, context })
    });
    const json = await res.json();
    return json.response || '';
  }

  async embed(text: string): Promise<number[]> {
    const res = await fetch(`${this.apiUrl}/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify({ text })
    });
    const json = await res.json();
    return json.embedding || [];
  }
} 