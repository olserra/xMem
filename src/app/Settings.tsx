'use client';

import React, { useState, useEffect } from 'react';
import { Lock, PlusCircle, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';

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

interface Organization {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  role?: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'context' | 'api-key' | 'organization'>('api-key');
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [org, setOrg] = useState<Organization | null>(null);
  const [orgsLoading, setOrgsLoading] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [inviting, setInviting] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

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

  // Fetch organization
  useEffect(() => {
    if (activeTab === 'organization') {
      setOrgsLoading(true);
      fetch('/api/organizations')
        .then(res => res.json())
        .then(data => setOrg(data[0] || null))
        .catch(() => setOrgError('Failed to load organization'))
        .finally(() => setOrgsLoading(false));
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
  const handleCopy = async (key: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(key);
      if (id) {
        setCopiedKeyId(id);
        setTimeout(() => setCopiedKeyId(null), 2000);
      }
    } catch {
      setError('Failed to copy key');
    }
  };

  // Toggle show/hide key
  const handleShowKey = (id: string) => {
    setShowKeyId(showKeyId === id ? null : id);
  };

  // Create organization
  const handleCreateOrg = async () => {
    if (!orgName) return;
    setCreatingOrg(true);
    setOrgError(null);
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName, description: orgDesc }),
      });
      if (!res.ok) throw new Error('Failed to create organization');
      setOrg(await res.json());
      setOrgName('');
      setOrgDesc('');
    } catch {
      setOrgError('Failed to create organization');
    } finally {
      setCreatingOrg(false);
    }
  };

  // Invite user
  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    setOrgError(null);
    try {
      const res = await fetch('/api/organizations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) throw new Error('Failed to invite user');
      setInviteEmail('');
      setInviteRole('MEMBER');
    } catch {
      setOrgError('Failed to invite user');
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings interface */}
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {['api-key', 'organization'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors cursor-pointer ${activeTab === tab ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-indigo-600'}`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab === 'api-key' ? 'API Keys' : 'Organization'}
            </button>
          ))}
        </div>

        {/* Organization Settings */}
        {activeTab === 'organization' && (
          <div className="space-y-8">
            {orgsLoading ? (
              <div className="text-slate-500">Loading organization...</div>
            ) : org ? (
              <div className="border rounded-md p-6 bg-white">
                <h2 className="text-lg font-medium text-slate-800 mb-1">{org.name}</h2>
                <p className="text-slate-500 mb-2">{org.description}</p>
                <div className="mb-4 text-xs text-slate-400">Created: {new Date(org.createdAt).toLocaleDateString()}</div>
                {/* Invite form (OWNER/ADMIN only) */}
                {(org.role === 'OWNER' || org.role === 'ADMIN') && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Invite User</h3>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="email"
                        className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        placeholder="Email address"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        disabled={inviting}
                      />
                      <select
                        className="px-2 py-2 border border-slate-300 rounded-md text-sm"
                        value={inviteRole}
                        onChange={e => setInviteRole(e.target.value)}
                        disabled={inviting}
                      >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                        onClick={handleInvite}
                        disabled={inviting || !inviteEmail}
                      >
                        <PlusCircle size={16} /> Invite
                      </button>
                    </div>
                  </div>
                )}
                {orgError && <div className="text-red-600 mt-2">{orgError}</div>}
              </div>
            ) : (
              <div className="border rounded-md p-6 bg-white">
                <h2 className="text-lg font-medium text-slate-800 mb-1">Create Organization</h2>
                <input
                  type="text"
                  className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Organization name"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  disabled={creatingOrg}
                />
                <textarea
                  className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Description (optional)"
                  value={orgDesc}
                  onChange={e => setOrgDesc(e.target.value)}
                  disabled={creatingOrg}
                />
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                  onClick={handleCreateOrg}
                  disabled={creatingOrg || !orgName}
                >
                  <PlusCircle size={16} /> Create Organization
                </button>
                {orgError && <div className="text-red-600 mt-2">{orgError}</div>}
              </div>
            )}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-wrap gap-2 items-center">
                              <button
                                className={`flex items-center gap-1 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer transition-colors ${showKeyId === key.id ? 'ring-2 ring-indigo-400' : ''}`}
                                onClick={() => handleShowKey(key.id)}
                                aria-label={showKeyId === key.id ? 'Hide Key' : 'View Key'}
                              >
                                {showKeyId === key.id ? <EyeOff size={16} /> : <Eye size={16} />} {showKeyId === key.id ? 'Hide' : 'View'}
                              </button>
                              {showKeyId === key.id && (
                                <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs cursor-pointer select-all border border-slate-200" onClick={() => handleCopy(key.key, key.id)}>{key.key}</span>
                              )}
                              <button
                                className="flex items-center gap-1 px-3 py-1 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs cursor-pointer transition-colors"
                                onClick={() => handleCopy(key.key, key.id)}
                                aria-label="Copy Key"
                                disabled={copiedKeyId === key.id}
                              >
                                <Copy size={16} /> {copiedKeyId === key.id ? 'Copied!' : 'Copy'}
                              </button>
                              <button
                                className="flex items-center gap-1 px-3 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs cursor-pointer transition-colors"
                                onClick={() => handleRevokeKey(key.id)}
                                aria-label="Revoke Key"
                              >
                                <Trash2 size={16} /> Revoke
                              </button>
                            </div>
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