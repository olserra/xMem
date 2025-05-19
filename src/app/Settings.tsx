'use client';

import React, { useState } from 'react';
import { Save, Trash, RefreshCw, AlertTriangle, Lock, Database, LayoutDashboard, PlusCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab] = useState('general');

  // Example settings
  const memorySettings = {
    vectorDbUrl: 'https://qdrant.example.com:6333',
    apiKey: '********-****-****-****-************',
    maxCacheSize: 500,
    sessionTtl: 3600,
    embeddingModel: 'text-embedding-3-small',
  };

  const ragSettings = {
    defaultMaxTokens: 4000,
    chunkSize: 512,
    overlapSize: 128,
    defaultRankingMethod: 'smart',
    autoSyncInterval: 30,
  };

  return (
    <div className="space-y-6">
      {/* Settings interface */}
      <div className="p-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                <LayoutDashboard size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-slate-800 mb-1">General Settings</h2>
                <p className="text-sm text-slate-500 mb-6">Configure basic application preferences</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="appName">
                      Application Name
                    </label>
                    <input
                      type="text"
                      id="appName"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      defaultValue="MemOrchestra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="theme">
                      Theme
                    </label>
                    <select
                      id="theme"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      defaultValue="system"
                    >
                      <option value="system">System Default</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="loggingLevel">
                    Logging Level
                  </label>
                  <select
                    id="loggingLevel"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue="info"
                  >
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                    <option value="trace">Trace</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Memory Settings */}
        {activeTab === 'memory' && (
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                <Database size={20} className="text-indigo-600" />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-medium text-slate-800 mb-1">Memory Settings</h2>
                <p className="text-sm text-slate-500 mb-6">Configure vector database and memory sources</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="vectorDbUrl">
                      Vector Database URL
                    </label>
                    <input
                      type="text"
                      id="vectorDbUrl"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      defaultValue={memorySettings.vectorDbUrl}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="apiKey">
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          id="apiKey"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue={memorySettings.apiKey}
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          <Lock size={16} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="embeddingModel">
                        Embedding Model
                      </label>
                      <select
                        id="embeddingModel"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={memorySettings.embeddingModel}
                      >
                        <option value="text-embedding-3-small">text-embedding-3-small</option>
                        <option value="text-embedding-3-large">text-embedding-3-large</option>
                        <option value="text-embedding-ada-002">text-embedding-ada-002 (Legacy)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="maxCacheSize">
                        Max Cache Size (MB)
                      </label>
                      <input
                        type="number"
                        id="maxCacheSize"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={memorySettings.maxCacheSize}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="sessionTtl">
                        Session TTL (seconds)
                      </label>
                      <input
                        type="number"
                        id="sessionTtl"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={memorySettings.sessionTtl}
                      />
                    </div>
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      id="enableCache"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="enableCache" className="ml-2 block text-sm text-slate-700">
                      Enable local memory cache
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 flex justify-between">
              <button className="flex items-center gap-2 px-4 py-2 border border-rose-300 text-rose-700 rounded-md hover:bg-rose-50 transition-colors">
                <Trash size={16} />
                <span>Clear All Memory</span>
              </button>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-indigo-300 text-indigo-700 rounded-md hover:bg-indigo-50 transition-colors">
                  <RefreshCw size={16} />
                  <span>Test Connection</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Context & RAG Settings */}
        {activeTab === 'context' && (
          <div className="space-y-8">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Advanced Settings</h3>
                <p className="text-sm text-amber-700 mt-1">
                  These settings affect how context is selected and ranked. Changing them may impact the quality of responses.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="defaultMaxTokens">
                  Default Max Tokens
                </label>
                <input
                  type="number"
                  id="defaultMaxTokens"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={ragSettings.defaultMaxTokens}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Maximum number of tokens to include in context window
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="defaultRankingMethod">
                  Default Ranking Method
                </label>
                <select
                  id="defaultRankingMethod"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={ragSettings.defaultRankingMethod}
                >
                  <option value="smart">Smart (Multi-factor)</option>
                  <option value="similarity">Similarity</option>
                  <option value="recency">Recency</option>
                  <option value="manual">Manual Selection</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="chunkSize">
                  Chunk Size
                </label>
                <input
                  type="number"
                  id="chunkSize"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={ragSettings.chunkSize}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Size of text chunks for processing (in tokens)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="overlapSize">
                  Overlap Size
                </label>
                <input
                  type="number"
                  id="overlapSize"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={ragSettings.overlapSize}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Overlap between chunks to maintain context (in tokens)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="autoSyncInterval">
                Auto-Sync Interval (minutes)
              </label>
              <input
                type="number"
                id="autoSyncInterval"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue={ragSettings.autoSyncInterval}
              />
              <p className="mt-1 text-xs text-slate-500">
                How often to automatically sync with the vector database (0 to disable)
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6 flex justify-end gap-3">
              <button className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors">
                Reset to Defaults
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* API Keys Settings */}
        {activeTab === 'api' && (
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                <Lock size={20} className="text-indigo-600" />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-medium text-slate-800 mb-1">API Keys</h2>
                <p className="text-sm text-slate-500 mb-6">Manage API keys for external integrations</p>

                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Last Used
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-slate-800">Production Key</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          2025-03-15
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          2 hours ago
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                          <button className="text-rose-600 hover:text-rose-900">Revoke</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-slate-800">Development Key</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          2025-04-02
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          5 days ago
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                          <button className="text-rose-600 hover:text-rose-900">Revoke</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button className="mt-4 flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors">
                  <PlusCircle size={16} />
                  <span>Generate New API Key</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;