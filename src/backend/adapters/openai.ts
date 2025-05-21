import { LLMProvider } from '../xmem';
import fetch from 'node-fetch';

type OpenAIConfig = {
  apiKey: string;
  model: string;
  apiUrl?: string;
};

export class OpenAIAdapter implements LLMProvider {
  private apiKey: string;
  private model: string;
  private apiUrl: string;

  constructor(config: OpenAIConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.apiUrl = config.apiUrl || 'https://api.openai.com/v1';
  }

  async generateResponse(prompt: string, context?: Record<string, unknown>): Promise<string> {
    const res = await fetch(`${this.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          ...(context?.messages || []),
          { role: 'user', content: prompt }
        ]
      })
    });
    const json = await res.json();
    return json.choices?.[0]?.message?.content || '';
  }

  async embed(text: string): Promise<number[]> {
    const res = await fetch(`${this.apiUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text
      })
    });
    const json = await res.json();
    return json.data?.[0]?.embedding || [];
  }
} 