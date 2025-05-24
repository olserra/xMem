import { LLMProvider } from '../xmem';

type HuggingFaceConfig = {
  apiUrl: string;
  apiKey: string;
};

type HuggingFaceResponse = Array<{
  generated_text?: string;
}>;

export class HuggingFaceAdapter implements LLMProvider {
  private apiUrl: string;
  private apiKey: string;

  constructor(config: HuggingFaceConfig) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
  }

  async generateResponse(prompt: string, context?: Record<string, unknown>): Promise<string> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ inputs: prompt, parameters: context })
    });
    const json = await res.json() as HuggingFaceResponse;
    return json[0]?.generated_text || '';
  }

  async embed(_text: string, _model?: string): Promise<number[]> {
    throw new Error('Embedding not implemented for HuggingFace');
  }
} 