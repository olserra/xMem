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
  language?: 'js' | 'python' | 'curl';
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ endpoint, language = 'js' }) => {
  const [copied, setCopied] = React.useState(false);

  // For JS code snippets, use the environment variable for the base URL
  // For Python/curl, add a comment to instruct users to set the base URL as an environment variable
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  // Generate code sample based on endpoint and language
  const generateCode = () => {
    if (endpoint.id === 'query') {
      if (language === 'js') {
        return `// Query with Context Example\nconst response = await fetch('https://www.xmem.xyz/api/query', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer YOUR_API_KEY'\n  },\n  body: JSON.stringify({\n    query: "What were the key decisions in yesterday's meeting?",\n    sessionId: "session_12345",\n    maxTokens: 4000,\n    rankingMethod: "smart"\n  })\n});\n\nconst result = await response.json();\nconsole.log(result.response); // LLM response with context`;
      } else if (language === 'python') {
        return `# Query with Context Example\nimport requests\n\nurl = 'https://www.xmem.xyz/api/query'\nheaders = {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer YOUR_API_KEY'\n}\npayload = {\n    'query': "What were the key decisions in yesterday's meeting?",\n    'sessionId': 'session_12345',\n    'maxTokens': 4000,\n    'rankingMethod': 'smart'\n}\nresponse = requests.post(url, headers=headers, json=payload)\nprint(response.json()['response'])  # LLM response with context`;
      } else if (language === 'curl') {
        return `# Query with Context Example\ncurl -X POST https://www.xmem.xyz/api/query \\n  -H "Content-Type: application/json" \\n  -H "Authorization: Bearer YOUR_API_KEY" \\n  -d '{"query": "What were the key decisions in yesterday's meeting?", "sessionId": "session_12345", "maxTokens": 4000, "rankingMethod": "smart"}'`;
      }
    }
    if (endpoint.id === 'session') {
      if (language === 'js') {
        return `// Create a new session\nconst response = await fetch('https://www.xmem.xyz/api/sessions', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer YOUR_API_KEY'\n  },\n  body: JSON.stringify({\n    name: "Customer Support Session",\n    ttl: 3600 // Session expiry in seconds\n  })\n});\n\nconst session = await response.json();\nconst sessionId = session.id; // Use this for subsequent queries`;
      } else if (language === 'python') {
        return `# Create a new session\nimport requests\n\nurl = 'https://www.xmem.xyz/api/sessions'\nheaders = {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer YOUR_API_KEY'\n}\npayload = {\n    'name': 'Customer Support Session',\n    'ttl': 3600\n}\nresponse = requests.post(url, headers=headers, json=payload)\nsession = response.json()\nsession_id = session['id']  # Use this for subsequent queries`;
      } else if (language === 'curl') {
        return `# Create a new session\ncurl -X POST https://www.xmem.xyz/api/sessions \\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d '{"name": "Customer Support Session", "ttl": 3600}'`;
      }
    }
    if (endpoint.id === 'feedback') {
      if (language === 'js') {
        return `// Submit feedback on context relevance\nconst response = await fetch('https://www.xmem.xyz/api/feedback', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer YOUR_API_KEY'\n  },\n  body: JSON.stringify({\n    queryId: "query_6789",\n    rating: 4, // Scale of 1-5\n    comments: "Context was relevant but missed recent updates"\n  })\n});\n\nconst result = await response.json();\nconsole.log(result.status); // Feedback submission status`;
      } else if (language === 'python') {
        return `# Submit feedback on context relevance\nimport requests\n\nurl = 'https://www.xmem.xyz/api/feedback'\nheaders = {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer YOUR_API_KEY'\n}\npayload = {\n    'queryId': 'query_6789',\n    'rating': 4,\n    'comments': 'Context was relevant but missed recent updates'\n}\nresponse = requests.post(url, headers=headers, json=payload)\nprint(response.json()['status'])  # Feedback submission status`;
      } else if (language === 'curl') {
        return `# Submit feedback on context relevance\ncurl -X POST https://www.xmem.xyz/api/feedback \\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d '{"queryId": "query_6789", "rating": 4, "comments": "Context was relevant but missed recent updates"}'`;
      }
    }
    if (endpoint.id === 'context') {
      if (language === 'js') {
        return `// Preview context for a query\nconst query = encodeURIComponent("What is our current project timeline?");\nconst response = await fetch(\n  \`https://www.xmem.xyz/api/context?query=\${query}&sessionId=session_12345\`,\n  {\n    method: 'GET',\n    headers: {\n      'Authorization': 'Bearer YOUR_API_KEY'\n    }\n  }\n);\n\nconst preview = await response.json();\nconsole.log(preview.contextItems); // Array of context items that would be used`;
      } else if (language === 'python') {
        return `# Preview context for a query\nimport requests\n\nquery = "What is our current project timeline?"\nurl = f'https://www.xmem.xyz/api/context?query={requests.utils.quote(query)}&sessionId=session_12345'\nheaders = {\n    'Authorization': 'Bearer YOUR_API_KEY'\n}\nresponse = requests.get(url, headers=headers)\npreview = response.json()\nprint(preview['contextItems'])  # Array of context items that would be used`;
      } else if (language === 'curl') {
        return `# Preview context for a query\ncurl -X GET "https://www.xmem.xyz/api/context?query=What%20is%20our%20current%20project%20timeline%3F&sessionId=session_12345" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`;
      }
    }
    if (endpoint.id === 'memory') {
      if (language === 'js') {
        return `// Add a memory item\nconst response = await fetch('https://www.xmem.xyz/api/memory', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer YOUR_API_KEY'\n  },\n  body: JSON.stringify({\n    action: "add",\n    data: {\n      id: "memory_001",\n      text: "Alice is a vegetarian and allergic to nuts.",\n      metadata: { food: "vegan" },\n      sessionId: "session_12345"\n    }\n  })\n});\n\nconst result = await response.json();\nconsole.log(result.status); // Memory add status`;
      } else if (language === 'python') {
        return `# Add a memory item\nimport requests\n\nurl = 'https://www.xmem.xyz/api/memory'\nheaders = {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer YOUR_API_KEY'\n}\npayload = {\n    'action': 'add',\n    'data': {\n        'id': 'memory_001',\n        'text': 'Alice is a vegetarian and allergic to nuts.',\n        'metadata': { 'food': 'vegan' },\n        'sessionId': 'session_12345'\n    }\n}\nresponse = requests.post(url, headers=headers, json=payload)\nprint(response.json()['status'])  # Memory add status`;
      } else if (language === 'curl') {
        return `# Add a memory item\ncurl -X POST https://www.xmem.xyz/api/memory \\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d '{"action": "add", "data": {"id": "memory_001", "text": "Alice is a vegetarian and allergic to nuts.", "metadata": {"food": "vegan"}, "sessionId": "session_12345"}}'`;
      }
    }
    return `// Example code for ${endpoint.name}\n// Refer to API documentation for implementation details`;
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