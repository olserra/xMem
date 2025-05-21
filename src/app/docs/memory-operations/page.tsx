import React from 'react';
import SimpleCodeBlock from '../../../components/SimpleCodeBlock';

export default function MemoryOperations() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-4">Memory Operations</h1>
            <p className="text-slate-300 mb-6">
                xmem provides a simple and flexible API for managing memory:
            </p>
            <h2 className="text-xl font-semibold text-white mb-2">Add Memory</h2>
            <SimpleCodeBlock code={`orchestrator.addMemory({
  id: 'memory-1',
  text: 'Alex is a vegetarian and allergic to nuts.',
  metadata: { food: 'vegan' },
  sessionId: 'session-123',
});`} language="js" />
            <h2 className="text-xl font-semibold text-white mb-2">Search Memory</h2>
            <SimpleCodeBlock code={`const results = await orchestrator.semanticSearch('What do you know about Alex?', {
  topK: 5,
  vectorProvider: 'chromadb',
});`} language="js" />
            <h2 className="text-xl font-semibold text-white mb-2">Update Memory</h2>
            <SimpleCodeBlock code={`// Update by deleting and re-adding with the same id
await orchestrator.deleteMemory('memory-1');
await orchestrator.addMemory({ id: 'memory-1', text: 'Alex is now vegan.' });`} language="js" />
            <h2 className="text-xl font-semibold text-white mb-2">Delete Memory</h2>
            <SimpleCodeBlock code={`await orchestrator.deleteMemory('memory-1');`} language="js" />
            <p className="text-slate-400 mt-4">
                <b>Tip:</b> You can filter, batch, and combine operations for advanced workflows.
            </p>
        </div>
    );
} 