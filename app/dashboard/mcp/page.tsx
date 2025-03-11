'use client';

import { McpStatus } from '@/app/components/mcp/McpStatus';
import { AiSuggestions } from '@/app/components/mcp/AiSuggestions';
import { ContextViewer } from '@/app/components/mcp/ContextViewer';

export default function MCPDashboard() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Memory Control Panel</h1>
                <McpStatus />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <ContextViewer />
                </div>

                <div className="col-span-2">
                    <AiSuggestions />
                </div>
            </div>
        </div>
    );
} 