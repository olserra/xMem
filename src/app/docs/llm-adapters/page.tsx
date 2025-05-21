'use client';
import React from 'react';
import SimpleCodeBlock from '../../../components/SimpleCodeBlock';

export default function LLMAdaptersDocs() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-4">Supported LLM Providers</h1>
      <p className="text-slate-300 mb-6">
        xmem supports a wide range of LLM providers via adapters. You can register and use any of the following:
      </p>
      <ul className="list-disc list-inside text-slate-200 mb-6">
        <li>Llama.cpp</li>
        <li>HuggingFace Inference API</li>
        <li>Ollama</li>
        <li>OpenAI</li>
        <li>Gemini (Google AI)</li>
      </ul>
      <h2 className="text-xl font-semibold text-white mb-2">Example: Registering Adapters</h2>
      <SimpleCodeBlock
        code={`import { XmemOrchestrator } from './xmem';
import { LlamaCppAdapter } from './adapters/llamaCpp';
import { HuggingFaceAdapter } from './adapters/huggingface';
import { OllamaAdapter } from './adapters/ollama';
import { OpenAIAdapter } from './adapters/openai';
import { GeminiAdapter } from './adapters/gemini';

const orchestrator = new XmemOrchestrator();

orchestrator.registerProvider('llm', 'llama', new LlamaCppAdapter({ apiUrl: 'http://localhost:8080' }));
orchestrator.registerProvider('llm', 'huggingface', new HuggingFaceAdapter({
  apiUrl: 'https://api-inference.huggingface.co/models/your-model',
  apiKey: 'YOUR_HF_API_KEY'
}));
orchestrator.registerProvider('llm', 'ollama', new OllamaAdapter({
  apiUrl: 'http://localhost:11434',
  model: 'llama2'
}));
orchestrator.registerProvider('llm', 'openai', new OpenAIAdapter({
  apiKey: 'YOUR_OPENAI_API_KEY',
  model: 'gpt-3.5-turbo'
}));
orchestrator.registerProvider('llm', 'gemini', new GeminiAdapter({
  apiKey: 'YOUR_GEMINI_API_KEY'
}));

orchestrator.setDefaultProvider('llm', 'llama');

// Use Gemini for a specific request
const response = await orchestrator.query({
  input: 'What is the weather today?',
  sessionId: 'sess1',
  llmProvider: 'gemini'
});
console.log(response);`}
        language="typescript"
      />
      <p className="text-slate-300">
        You can swap or add new providers at any time. See the <b>adapters</b> directory for implementation details.
      </p>
    </div>
  );
} 