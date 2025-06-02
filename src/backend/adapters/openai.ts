import { LLMProvider } from '../xmem';

type OpenAIConfig = {
  apiKey: string;
  model: string;
  apiUrl?: string;
};

type OpenAIChatMessage = { role: string; content: string };

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
    const url = `${this.apiUrl}/chat/completions`;
    const body = {
      model: this.model,
      messages: [
        ...((Array.isArray(context?.messages) ? context.messages : []) as OpenAIChatMessage[]),
        { role: 'user', content: prompt }
      ]
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
    console.log('OpenRouter request URL:', url);
    console.log('OpenRouter request headers:', headers);
    console.log('OpenRouter request body:', JSON.stringify(body, null, 2));
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    let json: any;
    try {
      json = await res.json();
    } catch (e) {
      console.error('OpenAIAdapter: Failed to parse response JSON', e);
      return 'Error: Failed to parse LLM response.';
    }
    if (!res.ok) {
      console.error('OpenAIAdapter: LLM API error', json);
      return `Error: LLM API error: ${json.error?.message || res.statusText}`;
    }
    if (json.error) {
      console.error('OpenAIAdapter: LLM API returned error', json.error);
      return `Error: LLM API error: ${json.error.message}`;
    }
    return json.choices?.[0]?.message?.content || 'Error: LLM returned no content.';
  }

  async embed(text: string, model?: string): Promise<number[]> {
    const res = await fetch(`${this.apiUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: model || this.model,
        input: text
      })
    });
    const json = await res.json();
    return json.data?.[0]?.embedding || [];
  }
} 