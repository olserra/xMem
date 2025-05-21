import { LLMProvider } from '../xmem';
import fetch from 'node-fetch';

type GeminiConfig = {
  apiKey: string;
  model?: string;
  apiUrl?: string;
};

export class GeminiAdapter implements LLMProvider {
  private apiKey: string;
  private model: string;
  private apiUrl: string;

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-pro';
    this.apiUrl = config.apiUrl || 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  async generateResponse(prompt: string): Promise<string> {
    const res = await fetch(
      `${this.apiUrl}/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async embed(): Promise<number[]> {
    throw new Error('Embedding not implemented for Gemini');
  }
} 