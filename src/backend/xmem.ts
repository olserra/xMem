// XmemOrchestrator: Abstract, flexible orchestrator for memory operations across pluggable vector stores, session stores, and LLM providers

// --- Interfaces for pluggable backends ---
export interface VectorStore {
  addEmbedding(data: { id: string; embedding: number[]; metadata?: Record<string, unknown> }): Promise<void>;
  searchEmbedding(query: number[], topK: number): Promise<unknown[]>;
  deleteEmbedding(id: string): Promise<void>;
}

export interface SessionStore {
  getSession(sessionId: string): Promise<Record<string, unknown> | null>;
  setSession(sessionId: string, data: Record<string, unknown>): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
}

export interface LLMProvider {
  generateResponse(prompt: string, context?: Record<string, unknown>): Promise<string>;
  embed(text: string): Promise<number[]>;
}

// --- Provider Registry Types ---
export type ProviderType = 'vector' | 'session' | 'llm';

export interface ProviderRegistry {
  vector: Record<string, VectorStore>;
  session: Record<string, SessionStore>;
  llm: Record<string, LLMProvider>;
}

// --- Orchestrator ---
export class XmemOrchestrator {
  private providers: ProviderRegistry;
  private defaultProviders: { vector: string; session: string; llm: string };

  constructor() {
    this.providers = { vector: {}, session: {}, llm: {} };
    this.defaultProviders = { vector: '', session: '', llm: '' };
  }

  // Register a provider (adapter)
  registerProvider<T extends ProviderType>(type: T, name: string, provider: ProviderRegistry[T][string]) {
    this.providers[type][name] = provider as VectorStore | SessionStore | LLMProvider;
    if (!this.defaultProviders[type]) this.defaultProviders[type] = name;
  }

  // Set default provider for each type
  setDefaultProvider(type: ProviderType, name: string) {
    if (this.providers[type][name]) this.defaultProviders[type] = name;
  }

  // Get provider by type and name (or default)
  getProvider<T>(type: ProviderType, name?: string): T {
    const key = name || this.defaultProviders[type];
    if (!key || !this.providers[type][key]) {
      throw new Error(`Provider for type '${type}' and name '${key}' not found.`);
    }
    return this.providers[type][key] as T;
  }

  // --- Core Methods (now with provider selection) ---

  async addMemory(memory: { id: string; text: string; metadata?: Record<string, unknown>; sessionId?: string; vectorProvider?: string; sessionProvider?: string; llmProvider?: string }) {
    const vectorStore = this.getProvider<VectorStore>('vector', memory.vectorProvider);
    const sessionStore = this.getProvider<SessionStore>('session', memory.sessionProvider);
    const llmProvider = this.getProvider<LLMProvider>('llm', memory.llmProvider);

    const embedding = await llmProvider.embed(memory.text);
    await vectorStore.addEmbedding({ id: memory.id, embedding, metadata: memory.metadata });
    if (memory.sessionId) await sessionStore.setSession(memory.sessionId, memory as Record<string, unknown>);
  }

  async getMemoryByEmbedding(queryText: string, opts?: { topK?: number; vectorProvider?: string; llmProvider?: string }) {
    const llmProvider = this.getProvider<LLMProvider>('llm', opts?.llmProvider);
    const vectorStore = this.getProvider<VectorStore>('vector', opts?.vectorProvider);
    const embedding = await llmProvider.embed(queryText);
    return vectorStore.searchEmbedding(embedding, opts?.topK || 5);
  }

  async deleteMemory(id: string, opts?: { sessionId?: string; vectorProvider?: string; sessionProvider?: string }) {
    const vectorStore = this.getProvider<VectorStore>('vector', opts?.vectorProvider);
    await vectorStore.deleteEmbedding(id);
    if (opts?.sessionId) {
      const sessionStore = this.getProvider<SessionStore>('session', opts.sessionProvider);
      await sessionStore.deleteSession(opts.sessionId);
    }
  }

  async semanticSearch(query: string, opts?: { topK?: number; vectorProvider?: string; llmProvider?: string }) {
    return this.getMemoryByEmbedding(query, opts);
  }

  async assembleContext(sessionId: string, query: string, opts?: { vectorProvider?: string; sessionProvider?: string; llmProvider?: string }) {
    const sessionStore = this.getProvider<SessionStore>('session', opts?.sessionProvider);
    const sessionMemory = await sessionStore.getSession(sessionId);
    const longTermMemory = await this.semanticSearch(query, { ...opts, topK: 5 });
    return { sessionMemory, longTermMemory };
  }

  async query({ input, sessionId, vectorProvider, sessionProvider, llmProvider }: { input: string; sessionId: string; vectorProvider?: string; sessionProvider?: string; llmProvider?: string }) {
    const context = await this.assembleContext(sessionId, input, { vectorProvider, sessionProvider, llmProvider });
    const llm = this.getProvider<LLMProvider>('llm', llmProvider);
    return llm.generateResponse(input, context);
  }
}

// --- Example: Adapter registration (to be done in your app entrypoint) ---
// orchestrator.registerProvider('vector', 'chromadb', new ChromaDBAdapter(/* config */));
// orchestrator.registerProvider('vector', 'qdrant', new QdrantAdapter(/* config */));
// orchestrator.registerProvider('session', 'redis', new RedisAdapter(/* config */));
// orchestrator.registerProvider('llm', 'mistral', new MistralAdapter(/* config */));
// orchestrator.setDefaultProvider('vector', 'chromadb');
// orchestrator.setDefaultProvider('session', 'redis');
// orchestrator.setDefaultProvider('llm', 'mistral'); 