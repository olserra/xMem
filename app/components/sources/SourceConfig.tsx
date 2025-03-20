'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Loader2, Save, Trash2, RefreshCw, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface SourceConfig {
    id: string;
    source: string;
    apiKey?: string;
    apiSecret?: string;
    webhookUrl?: string;
    isEnabled: boolean;
    lastSync?: string;
    syncInterval?: number;
}

interface SyncResult {
    success: boolean;
    message: string;
    count?: number;
}

const AVAILABLE_SOURCES = [
    { id: 'cursorAI', name: 'Cursor AI', description: 'Integrate with Cursor AI for enhanced code assistance' },
    { id: 'bolt.new', name: 'Bolt.new', description: 'Connect with Bolt.new for seamless development workflow' },
    { id: 'lovable', name: 'Lovable', description: 'Integrate with Lovable for user feedback management' },
    { id: 'chatGPT', name: 'ChatGPT', description: 'Connect with ChatGPT for AI-powered conversations' },
    { id: 'claude', name: 'Claude', description: 'Integrate with Claude for advanced AI assistance' },
];

export function SourceConfig() {
    const [configs, setConfigs] = useState<SourceConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [syncing, setSyncing] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState(AVAILABLE_SOURCES[0].id);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const response = await fetch('/api/source-config');
            if (response.ok) {
                const data = await response.json();
                setConfigs(data);
            }
        } catch (error) {
            console.error('Error fetching source configs:', error);
            toast.error('Failed to fetch source configurations');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (config: Partial<SourceConfig> & { source: string }) => {
        setSaving(true);
        try {
            const fullConfig: SourceConfig = {
                id: config.id || config.source,
                source: config.source,
                apiKey: config.apiKey,
                apiSecret: config.apiSecret,
                webhookUrl: config.webhookUrl,
                isEnabled: config.isEnabled || false,
                lastSync: config.lastSync,
                syncInterval: config.syncInterval,
            };

            const response = await fetch('/api/source-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fullConfig),
            });

            if (response.ok) {
                await fetchConfigs();
                toast.success('Configuration saved successfully');
            } else {
                toast.error('Failed to save configuration');
            }
        } catch (error) {
            console.error('Error saving source config:', error);
            toast.error('Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (source: string) => {
        try {
            const response = await fetch(`/api/source-config?source=${source}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchConfigs();
                toast.success('Configuration deleted successfully');
            } else {
                toast.error('Failed to delete configuration');
            }
        } catch (error) {
            console.error('Error deleting source config:', error);
            toast.error('Failed to delete configuration');
        }
    };

    const handleToggle = async (config: Partial<SourceConfig> & { source: string }) => {
        const updatedConfig = {
            ...config,
            isEnabled: !config.isEnabled,
        };
        await handleSave(updatedConfig);
    };

    const handleSync = async (source: string) => {
        setSyncing(prev => ({ ...prev, [source]: true }));
        try {
            const response = await fetch(`/api/sync?source=${source}`, {
                method: 'POST',
            });

            if (response.ok) {
                const result: SyncResult = await response.json();
                if (result.success) {
                    toast.success(result.message);
                    await fetchConfigs();
                } else {
                    toast.error(result.message);
                }
            } else {
                toast.error('Failed to sync data');
            }
        } catch (error) {
            console.error('Error syncing data:', error);
            toast.error('Failed to sync data');
        } finally {
            setSyncing(prev => ({ ...prev, [source]: false }));
        }
    };

    const renderSourceForm = (source: typeof AVAILABLE_SOURCES[0]) => {
        const config = configs.find((c) => c.source === source.id);

        return (
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">{source.name}</h3>
                        <p className="text-sm text-gray-500">
                            {source.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {config?.lastSync
                                ? `Last sync: ${new Date(config.lastSync).toLocaleString()}`
                                : 'Never synced'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={config?.isEnabled || false}
                                onCheckedChange={() => handleToggle(config || { source: source.id, isEnabled: false })}
                            />
                            <Label>Enabled</Label>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleSync(source.id)}
                            disabled={syncing[source.id]}
                        >
                            {syncing[source.id] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                        </Button>
                        {config && (
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(source.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-4 mt-6">
                    <div>
                        <Label htmlFor={`apiKey-${source.id}`}>API Key</Label>
                        <Input
                            id={`apiKey-${source.id}`}
                            type="password"
                            value={config?.apiKey || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleSave({
                                    ...config,
                                    source: source.id,
                                    apiKey: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <Label htmlFor={`apiSecret-${source.id}`}>API Secret</Label>
                        <Input
                            id={`apiSecret-${source.id}`}
                            type="password"
                            value={config?.apiSecret || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleSave({
                                    ...config,
                                    source: source.id,
                                    apiSecret: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <Label htmlFor={`webhookUrl-${source.id}`}>Webhook URL</Label>
                        <Input
                            id={`webhookUrl-${source.id}`}
                            value={config?.webhookUrl || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleSave({
                                    ...config,
                                    source: source.id,
                                    webhookUrl: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <Label htmlFor={`syncInterval-${source.id}`}>Sync Interval (minutes)</Label>
                        <Input
                            id={`syncInterval-${source.id}`}
                            type="number"
                            value={config?.syncInterval || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleSave({
                                    ...config,
                                    source: source.id,
                                    syncInterval: parseInt(e.target.value),
                                })
                            }
                        />
                    </div>

                    <Button
                        className="w-full mt-4"
                        onClick={() => handleSave(config || { source: source.id, isEnabled: false })}
                        disabled={saving}
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Configuration
                    </Button>
                </div>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-5 gap-4">
                        {AVAILABLE_SOURCES.map((source) => (
                            <TabsTrigger
                                key={source.id}
                                value={source.id}
                                className="w-full"
                            >
                                {source.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {AVAILABLE_SOURCES.map((source) => (
                        <TabsContent key={source.id} value={source.id}>
                            {renderSourceForm(source)}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
} 