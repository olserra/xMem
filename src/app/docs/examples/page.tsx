'use client';
import React from 'react';
import SimpleCodeBlock from '../../../components/SimpleCodeBlock';

export default function Examples() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-4">Integration Examples</h1>
            <p className="text-slate-300 mb-6">See how to use xmem in different scenarios and languages.</p>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl text-white font-semibold mb-2">Basic Query (JavaScript)</h2>
                    <SimpleCodeBlock code={`const response = await orchestrator.query({
  query: 'How does xmem work?',
  sessionId: 'user-123'
});
console.log(response);`} language="js" />
                </div>
                <div>
                    <h2 className="text-xl text-white font-semibold mb-2">Add Memory (Python)</h2>
                    <SimpleCodeBlock code={`import requests

res = requests.post('http://localhost:3000/api/memory', json={
  'action': 'add',
  'data': { 'text': 'Remember this fact.' }
})
print(res.json())`} language="python" />
                </div>
                <div>
                    <h2 className="text-xl text-white font-semibold mb-2">Session Management (cURL)</h2>
                    <SimpleCodeBlock code={`curl -X POST http://localhost:3000/api/sessions \
  -H 'Content-Type: application/json' \
  -d '{"name": "my-session"}'`} language="bash" />
                </div>
            </div>
        </div>
    );
} 