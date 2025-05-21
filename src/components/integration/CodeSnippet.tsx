import React from 'react';
import { Copy, Check } from 'lucide-react';

interface Endpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
}

interface CodeSnippetProps {
  endpoint: Endpoint;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ endpoint }) => {
  const [copied, setCopied] = React.useState(false);

  // Generate code sample based on endpoint
  const generateCode = () => {
    if (endpoint.id === 'query') {
      return `// Query with Context Example
const response = await fetch('https://api.memoryorchestrator.com/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    query: "What were the key decisions in yesterday's meeting?",
    sessionId: "session_12345",
    maxTokens: 4000,
    rankingMethod: "smart"
  })
});

const result = await response.json();
console.log(result.response); // LLM response with context`;
    }

    if (endpoint.id === 'session') {
      return `// Create a new session
const response = await fetch('https://api.memoryorchestrator.com/api/sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    name: "Customer Support Session",
    ttl: 3600 // Session expiry in seconds
  })
});

const session = await response.json();
const sessionId = session.id; // Use this for subsequent queries`;
    }

    if (endpoint.id === 'feedback') {
      return `// Submit feedback on context relevance
const response = await fetch('https://api.memoryorchestrator.com/api/feedback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    queryId: "query_6789",
    rating: 4, // Scale of 1-5
    comments: "Context was relevant but missed recent updates"
  })
});

const result = await response.json();
console.log(result.status); // Feedback submission status`;
    }

    if (endpoint.id === 'context') {
      return `// Preview context for a query
const query = encodeURIComponent("What is our current project timeline?");
const response = await fetch(
  \`https://api.memoryorchestrator.com/api/context?query=\${query}&sessionId=session_12345\`,
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  }
);

const preview = await response.json();
console.log(preview.contextItems); // Array of context items that would be used`;
    }

    if (endpoint.id === 'memory') {
      return `// Add a memory item
const response = await fetch('https://api.memoryorchestrator.com/api/memory', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    action: "add",
    data: {
      id: "memory_001",
      text: "Alice is a vegetarian and allergic to nuts.",
      metadata: { food: "vegan" },
      sessionId: "session_12345"
    }
  })
});

const result = await response.json();
console.log(result.status); // Memory add status`;
    }

    return `// Example code for ${endpoint.name}
// Refer to API documentation for implementation details`;
  };

  const code = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-md overflow-hidden">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
        </button>
      </div>

      <pre className="bg-slate-800 text-slate-100 p-4 rounded-md overflow-x-auto text-sm font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeSnippet;