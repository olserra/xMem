'use client';

import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Lock, PlusCircle, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import ContextSourceList from '../components/context/ContextSourceList';
import RankingControls from '../components/context/RankingControls';

// Define APIKey type
interface APIKey {
  id: string;
  name: string;
  key: string;
  userId: string;
  createdAt: string;
  lastUsed?: string | null;
  revokedAt?: string | null;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'context' | 'api-key'>('api-key');
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);

  const ragSettings = {
    defaultMaxTokens: 4000,
    chunkSize: 512,
    overlapSize: 128,
    defaultRankingMethod: 'smart',
    autoSyncInterval: 30,
  };

  // Fetch API keys
  useEffect(() => {
    if (activeTab === 'api-key') {
      setLoading(true);
      fetch('/api/api-keys')
        .then(res => res.json())
        .then(setApiKeys)
        .catch(() => setError('Failed to load API keys'))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  // Create new API key
  const handleCreateKey = async () => {
    if (!newKeyName) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });
      if (!res.ok) throw new Error('Failed to create key');
      const data = await res.json();
      setShowNewKey(data.key);
      setApiKeys(keys => [data, ...keys]);
      setNewKeyName('');
    } catch {
      setError('Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  // Revoke API key
  const handleRevokeKey = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await fetch('/api/api-keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setApiKeys(keys => keys.filter(k => k.id !== id));
    } catch {
      setError('Failed to revoke API key');
    } finally {
      setLoading(false);
    }
  };

  // Copy key to clipboard
  const handleCopy = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
    } catch {
      setError('Failed to copy key');
    }
  };

  // Toggle show/hide key
  const handleShowKey = (id: string) => {
    setShowKeyId(showKeyId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Settings interface */}
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {['memory', 'context', 'api-key'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors cursor-pointer ${activeTab === tab ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-indigo-600'}`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

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

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-slate-600 mb-2">Available Context Sources</h4>
                <ContextSourceList selectedSource="all" onSourceSelect={() => { }} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-600 mb-2">Ranking Controls</h4>
                <RankingControls method="smart" factors={{ similarity: 0.7, recency: 0.2, feedback: 0.1 }} onFactorChange={() => { }} />
              </div>
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
        {activeTab === 'api-key' && (
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                <Lock size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-slate-800 mb-1">API Keys</h2>
                <p className="text-sm text-slate-500 mb-6">Manage API keys for external integrations</p>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                {showNewKey && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                    <span className="font-mono text-green-800">{showNewKey}</span>
                    <button onClick={() => handleCopy(showNewKey)} className="ml-2 text-green-700 hover:text-green-900 cursor-pointer"><Copy size={16} /></button>
                    <span className="ml-2 text-xs text-green-700">Copy and store this key securely. You won&apos;t see it again!</span>
                    <button className="ml-auto text-slate-500 hover:text-slate-700 cursor-pointer" onClick={() => setShowNewKey(null)}><EyeOff size={16} /></button>
                  </div>
                )}
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Used</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {loading ? (
                        <tr><td colSpan={4} className="text-center py-6">Loading...</td></tr>
                      ) : apiKeys.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-6 text-slate-400">No API keys found.</td></tr>
                      ) : apiKeys.map(key => (
                        <tr key={key.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-slate-800">{key.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(key.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{key.lastUsed ? new Date(key.lastUsed).toLocaleString() : <span className="text-slate-300">Never</span>}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                            <button className="text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => handleShowKey(key.id)}>
                              {showKeyId === key.id ? <EyeOff size={16} /> : <Eye size={16} />} {showKeyId === key.id ? 'Hide' : 'View'}
                            </button>
                            {showKeyId === key.id && (
                              <span className="font-mono bg-slate-100 px-2 py-1 rounded ml-2 cursor-pointer" onClick={() => handleCopy(key.key)}>{key.key}</span>
                            )}
                            <button className="text-slate-600 hover:text-slate-900 cursor-pointer" onClick={() => handleCopy(key.key)}><Copy size={16} /></button>
                            <button className="text-rose-600 hover:text-rose-900 cursor-pointer" onClick={() => handleRevokeKey(key.id)}><Trash2 size={16} /> Revoke</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm cursor-pointer"
                    placeholder="Key name (e.g. Production, Dev)"
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    disabled={creating}
                  />
                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                    onClick={handleCreateKey}
                    disabled={creating || !newKeyName}
                  >
                    <PlusCircle size={16} />
                    <span>{creating ? 'Generating...' : 'Generate New API Key'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;