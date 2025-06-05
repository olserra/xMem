import { XmemOrchestrator } from '../xmem';

// Minimal MCP context schema (can be extended)
export interface MCPContext {
  id: string;
  sessionId?: string;
  text?: string;
  metadata?: Record<string, unknown>;
}

export class MCPAdapter {
  private orchestrator: XmemOrchestrator;

  constructor(orchestrator: XmemOrchestrator) {
    this.orchestrator = orchestrator;
  }

  async storeContext(context: MCPContext) {
    await this.orchestrator.addMemory({
      id: context.id,
      text: context.text || '',
      metadata: context.metadata,
      sessionId: context.sessionId,
    });
    return { status: 'ok' };
  }

  async retrieveContext(query: { id?: string; sessionId?: string }) {
    if (query.id) {
      // For demo: search by id in session and vector stores
      // (Extend as needed for full MCP spec)
      // Try session first
      if (query.sessionId) {
        const session = await this.orchestrator.getProvider<import('../xmem').SessionStore>('session').getSession(query.sessionId);
        if (session && session.id === query.id) return session;
      }
      // Fallback: search in vector store (by id in metadata)
      // (Assume vector store supports metadata search by id)
      // Not implemented: would require vector store to support this
    }
    return null;
  }

  async updateContext(context: MCPContext) {
    // For demo: just call storeContext (idempotent upsert)
    return this.storeContext(context);
  }

  async deleteContext(context: { id: string; sessionId?: string }) {
    await this.orchestrator.deleteMemory(context.id, { sessionId: context.sessionId });
    return { status: 'ok' };
  }
} 