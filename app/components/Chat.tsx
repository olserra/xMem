"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { MCPClient } from '@/app/services/mcp';
import { useSession } from 'next-auth/react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function Chat() {
    const { data: session, status } = useSession();
    const { user, bearerToken, userId } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (status === 'loading') {
            return;
        }
        
        if (status === 'unauthenticated') {
            setMessages([{
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Please sign in to use the chat feature.',
                timestamp: new Date(),
            }]);
            setIsInitializing(false);
            return;
        }
        
        if (status === 'authenticated' && !bearerToken) {
            setMessages([{
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Initializing chat... Please wait.',
                timestamp: new Date(),
            }]);
            return;
        }
        
        if (status === 'authenticated' && bearerToken) {
            setIsInitializing(false);
        }
    }, [status, bearerToken]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !bearerToken || status !== 'authenticated') return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    userId: userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Save important information to memory if flagged by the model
            if (data.shouldSaveToMemory && bearerToken) {
                try {
                    const mcpClient = new MCPClient(
                        process.env.NEXT_PUBLIC_MCP_URL || 'http://localhost:8000/mcp',
                        bearerToken,
                        userId
                    );
                    
                    await mcpClient.addMemory({
                        content: data.memoryContent || assistantMessage.content,
                        metadata: {
                            type: 'CHAT',
                            source: 'agent',
                            created_at: new Date().toISOString(),
                            tags: data.tags || ['chat'],
                        }
                    });
                } catch (memoryError) {
                    console.error('Failed to save to memory:', memoryError);
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitializing) {
        return (
            <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="mt-2 text-gray-600">Initializing chat...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                                message.role === 'user'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-900'
                            }`}
                        >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <span className="text-xs opacity-50 mt-1 block">
                                {message.timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={status === 'authenticated' ? "Type your message..." : "Please sign in to chat"}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                        disabled={isLoading || status !== 'authenticated' || !bearerToken}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim() || status !== 'authenticated' || !bearerToken}
                        className="p-2 bg-black text-white rounded-lg disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
} 