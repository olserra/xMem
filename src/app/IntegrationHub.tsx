'use client';

import React, { useState } from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';
import ApiEndpointCard from '../components/integration/ApiEndpointCard';
import CodeSnippet from '../components/integration/CodeSnippet';

const IntegrationHub: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('query');

  // Example API endpoints
  const endpoints = [
    {
      id: 'query',
      name: 'Query with Context',
      method: 'POST',
      path: '/api/query',
      description: 'Send a query and receive an LLM response with intelligently selected context.',
    },
    {
      id: 'session',
      name: 'Session Management',
      method: 'POST',
      path: '/api/sessions',
      description: 'Create and manage memory sessions for conversations.',
    },
    {
      id: 'feedback',
      name: 'Feedback Collection',
      method: 'POST',
      path: '/api/feedback',
      description: 'Submit feedback on context relevance to improve future rankings.',
    },
    {
      id: 'context',
      name: 'Context Preview',
      method: 'GET',
      path: '/api/context',
      description: 'Preview the context that would be selected for a given query.',
    },
    {
      id: 'memory',
      name: 'Memory Management',
      method: 'POST',
      path: '/api/memory',
      description: 'Add, update, or delete items in the memory store.',
    },
  ];

  // Get the selected endpoint
  const endpoint = endpoints.find((e) => e.id === selectedEndpoint);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Integration Hub</h1>
        <p className="text-slate-500 mt-1">API endpoints and integration guides for using the Memory Orchestrator</p>
      </div>

      {/* API endpoints grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {endpoints.map((ep) => (
          <ApiEndpointCard
            key={ep.id}
            endpoint={ep}
            isSelected={ep.id === selectedEndpoint}
            onSelect={() => setSelectedEndpoint(ep.id)}
          />
        ))}

        {/* Add new endpoint card */}
        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-transparent p-6 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-400 transition-colors cursor-pointer">
          <PlusCircle size={24} className="mb-2" />
          <p className="text-sm font-medium">Add Custom Endpoint</p>
        </div>
      </div>

      {/* API documentation */}
      {endpoint && (
        <div className="bg-white rounded-lg shadow-sm mt-6">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-lg text-slate-800">
              {endpoint.name} API
            </h2>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column: API details */}
              <div className="lg:w-1/2">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">ENDPOINT</h3>
                  <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-md">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${endpoint.method === 'GET' ? 'bg-emerald-100 text-emerald-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        endpoint.method === 'PUT' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                      }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-slate-800">{endpoint.path}</code>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">DESCRIPTION</h3>
                  <p className="text-slate-400">{endpoint.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">PARAMETERS</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Parameter
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Required
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {selectedEndpoint === 'query' && (
                          <>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">query</td>
                              <td className="px-4 py-3 text-sm text-slate-600">string</td>
                              <td className="px-4 py-3 text-sm text-slate-600">Yes</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">sessionId</td>
                              <td className="px-4 py-3 text-sm text-slate-600">string</td>
                              <td className="px-4 py-3 text-sm text-slate-600">No</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">maxTokens</td>
                              <td className="px-4 py-3 text-sm text-slate-600">number</td>
                              <td className="px-4 py-3 text-sm text-slate-600">No</td>
                            </tr>
                          </>
                        )}

                        {selectedEndpoint === 'session' && (
                          <>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">name</td>
                              <td className="px-4 py-3 text-sm text-slate-600">string</td>
                              <td className="px-4 py-3 text-sm text-slate-600">No</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">ttl</td>
                              <td className="px-4 py-3 text-sm text-slate-600">number</td>
                              <td className="px-4 py-3 text-sm text-slate-600">No</td>
                            </tr>
                          </>
                        )}

                        {selectedEndpoint === 'feedback' && (
                          <>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">queryId</td>
                              <td className="px-4 py-3 text-sm text-slate-600">string</td>
                              <td className="px-4 py-3 text-sm text-slate-600">Yes</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">rating</td>
                              <td className="px-4 py-3 text-sm text-slate-600">number</td>
                              <td className="px-4 py-3 text-sm text-slate-600">Yes</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">comments</td>
                              <td className="px-4 py-3 text-sm text-slate-600">string</td>
                              <td className="px-4 py-3 text-sm text-slate-600">No</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right column: Code examples */}
              <div className="lg:w-1/2">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-slate-500">CODE EXAMPLE</h3>
                  <div className="flex gap-2">
                    <button className="text-xs text-indigo-600 hover:text-indigo-800">JavaScript</button>
                    <button className="text-xs text-slate-500 hover:text-slate-700">Python</button>
                    <button className="text-xs text-slate-500 hover:text-slate-700">cURL</button>
                  </div>
                </div>

                <CodeSnippet endpoint={endpoint} />

                <button className="mt-4 flex items-center gap-2 text-indigo-600 text-sm hover:text-indigo-800">
                  <RefreshCw size={14} />
                  <span>Regenerate Example</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationHub;