'use client';
import React, { useState, useEffect } from 'react';
import { Brain, Zap, Database, MessageSquare, Sparkles, ArrowRight, Users, Clock, Cpu } from 'lucide-react';
import { signIn, useSession, SessionProvider } from 'next-auth/react';
import Header from './Header';
import Footer from '../components/layout/Footer';

export const handleSignIn = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    signIn('google', {
        callbackUrl: '/dashboard',
    });
};

const Landing: React.FC = () => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    // Fix hydration mismatch: generate random bubble data only on client
    const [bubbles, setBubbles] = useState<Array<{ size: number; color: string; x: number; y: number }>>([]);
    useEffect(() => {
        const colors = [
            'bg-teal-500/40', 'bg-indigo-500/40', 'bg-purple-500/40', 'bg-amber-500/40'
        ];
        setBubbles(
            Array.from({ length: 12 }).map(() => {
                const size = 12 + Math.floor(Math.random() * 24);
                const color = colors[Math.floor(Math.random() * colors.length)];
                const x = Math.random() * 10 - 5;
                const y = Math.random() * 10 - 5;
                return { size, color, x, y };
            })
        );
    }, []);

    // Fix hydration mismatch: generate random vector data for Vector Database Integration only on client
    const [vectorBubbles, setVectorBubbles] = useState<Array<{ x: number; y: number; size: number; i: number }>>([]);
    useEffect(() => {
        setVectorBubbles(
            Array.from({ length: 24 }).map((_, i) => {
                const x = 20 + Math.random() * 60;
                const y = 20 + Math.random() * 60;
                const size = 6 + Math.random() * 12;
                return { x, y, size, i };
            })
        );
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            <Header />
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Memory Orchestrator for LLMs</h1>
                <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-8">
                    Instantly supercharge your LLM apps with xmem: a hybrid memory, that combines long-term knowledge and real-time context for smarter, more relevant AI.
                </p>
                {!loading && session ? (
                    <a
                        href="/dashboard"
                        className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center gap-2 mb-6 cursor-pointer"
                    >
                        Go to dashboard <ArrowRight size={20} />
                    </a>
                ) : (
                    <button
                        className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center gap-2 mb-6 cursor-pointer"
                        onClick={handleSignIn}
                    >
                        Get Started Free <ArrowRight size={20} />
                    </button>
                )}
                {/* Visual Demo Placeholder */}
                <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-white font-semibold">Memory System Overview</h3>
                            <p className="text-slate-400 text-sm">Real-time memory orchestration</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-teal-500/20 rounded-full">
                                <span className="text-teal-300 text-sm">Live Demo</span>
                            </div>
                        </div>
                    </div>

                    {/* Mock Dashboard Content */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <Database size={16} className="text-indigo-400" />
                                <span className="text-slate-300 text-sm font-medium">Memory Distribution</span>
                            </div>
                            <div className="relative h-32">
                                <div className="absolute inset-0 flex items-end justify-between px-2">
                                    <div className="w-1/5 h-[60%] bg-indigo-600/40 rounded-t-md backdrop-blur-sm"></div>
                                    <div className="w-1/5 h-[85%] bg-indigo-500/40 rounded-t-md backdrop-blur-sm"></div>
                                    <div className="w-1/5 h-[45%] bg-indigo-400/40 rounded-t-md backdrop-blur-sm"></div>
                                    <div className="w-1/5 h-[75%] bg-indigo-300/40 rounded-t-md backdrop-blur-sm"></div>
                                    <div className="w-1/5 h-[55%] bg-indigo-200/40 rounded-t-md backdrop-blur-sm"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={16} className="text-purple-400" />
                                <span className="text-slate-300 text-sm font-medium">Context Relevance</span>
                            </div>
                            <div className="relative h-32">
                                <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2">
                                    {bubbles.map((bubble, i) => (
                                        <div
                                            key={i}
                                            className={`rounded-full ${bubble.color} backdrop-blur-sm`}
                                            style={{
                                                width: `${bubble.size}px`,
                                                height: `${bubble.size}px`,
                                                transform: `translate(${bubble.x}px, ${bubble.y}px)`
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mock Metrics */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                                <Database size={14} className="text-indigo-400" />
                                <span className="text-slate-400 text-xs">Total Memories</span>
                            </div>
                            <div className="text-white font-semibold">14,582</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                                <Cpu size={14} className="text-teal-400" />
                                <span className="text-slate-400 text-xs">Avg Context</span>
                            </div>
                            <div className="text-white font-semibold">4.2 KB</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock size={14} className="text-amber-400" />
                                <span className="text-slate-400 text-xs">Retrieval</span>
                            </div>
                            <div className="text-white font-semibold">42ms</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                                <Users size={14} className="text-purple-400" />
                                <span className="text-slate-400 text-xs">Sessions</span>
                            </div>
                            <div className="text-white font-semibold">187</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Problem/Solution */}
            <div className="container mx-auto px-6 py-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">LLMs forget. Your users notice.</h2>
                <p className="text-lg text-slate-300 mb-6">Stop losing context and knowledge between sessions. xmem orchestrates both persistent and session memory for every LLM callso your AI is always relevant, accurate, and up-to-date.</p>
            </div>
            {/* How It Works */}
            <div className="container mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold text-white text-center mb-8">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                        <Database size={32} className="text-indigo-400 mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">Long-Term Memory</h3>
                        <p className="text-slate-300 text-center">Store and retrieve knowledge, notes, and documents with vector search.</p>
                    </div>
                    <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                        <MessageSquare size={32} className="text-purple-400 mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">Session Memory</h3>
                        <p className="text-slate-300 text-center">Track recent chats, instructions, and context for recency and personalization.</p>
                    </div>
                    <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                        <Zap size={32} className="text-teal-400 mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">RAG Orchestration</h3>
                        <p className="text-slate-300 text-center">Automatically assemble the best context for every LLM callno manual tuning needed.</p>
                    </div>
                </div>
            </div>
            {/* Benefits */}
            <div className="container mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold text-white text-center mb-8">Why xmem?</h2>
                <ul className="max-w-2xl mx-auto text-left text-slate-300 space-y-3 text-lg">
                    <li><span className="text-teal-400 font-bold"></span> Never lose user knowledge or context again</li>
                    <li><span className="text-teal-400 font-bold"></span> Boost LLM accuracy and relevance</li>
                    <li><span className="text-teal-400 font-bold"></span> Works with any open-source LLM (Llama, Mistral, etc.)</li>
                    <li><span className="text-teal-400 font-bold"></span> Easy API and dashboard for integration and monitoring</li>
                </ul>
            </div>

            {/* Vector DB Integration */}
            <div className="container mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold text-white text-center mb-8">Intelligent Memory Management</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Vector DB Visualization */}
                    <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Database size={20} className="text-indigo-400" />
                                    Vector Database Integration
                                </h3>
                                <p className="text-slate-400 text-sm">Semantic search and retrieval</p>
                            </div>
                            <div className="px-3 py-1 bg-indigo-500/20 rounded-full">
                                <span className="text-indigo-300 text-sm">Active</span>
                            </div>
                        </div>
                        <div className="relative h-64 mb-4">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-full h-full">
                                    {vectorBubbles.map(({ x, y, size, i }) => (
                                        <div
                                            key={i}
                                            className="absolute bg-indigo-400/40 rounded-full"
                                            style={{
                                                left: `${x}%`,
                                                top: `${y}%`,
                                                width: `${size}px`,
                                                height: `${size}px`,
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            {i % 3 === 0 && (
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                                                    <div className="h-8 w-px bg-indigo-400/30"></div>
                                                    <div className="text-indigo-300 text-xs whitespace-nowrap mt-1">Vector {i + 1}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <svg className="absolute inset-0 w-full h-full">
                                        <path
                                            d="M 30% 40% L 45% 35% L 60% 45% L 70% 30%"
                                            stroke="rgba(129, 140, 248, 0.2)"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-900/40 rounded p-2">
                                <div className="text-xs text-slate-400">Embeddings</div>
                                <div className="text-white font-mono text-sm">768d</div>
                            </div>
                            <div className="bg-slate-900/40 rounded p-2">
                                <div className="text-xs text-slate-400">Chunks</div>
                                <div className="text-white font-mono text-sm">2.4k</div>
                            </div>
                            <div className="bg-slate-900/40 rounded p-2">
                                <div className="text-xs text-slate-400">Avg. Similarity</div>
                                <div className="text-white font-mono text-sm">0.82</div>
                            </div>
                        </div>
                    </div>

                    {/* Memory Orchestration */}
                    <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Zap size={20} className="text-teal-400" />
                                    Memory Orchestration
                                </h3>
                                <p className="text-slate-400 text-sm">Real-time context assembly</p>
                            </div>
                            <div className="px-3 py-1 bg-teal-500/20 rounded-full">
                                <span className="text-teal-300 text-sm">Processing</span>
                            </div>
                        </div>
                        <div className="relative h-64 mb-4">
                            <div className="absolute inset-0">
                                <div className="relative h-full">
                                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-teal-500/20 rounded-lg border border-slate-700/50"></div>
                                    <div className="absolute inset-x-0 top-20 h-16 bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-indigo-500/20 rounded-lg border border-slate-700/50"></div>
                                    <div className="absolute inset-x-0 top-40 h-16 bg-gradient-to-r from-indigo-500/20 via-teal-500/20 to-purple-500/20 rounded-lg border border-slate-700/50"></div>

                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute h-full w-px bg-gradient-to-b from-teal-400/40 via-purple-400/40 to-transparent"
                                            style={{
                                                left: `${20 + i * 20}%`,
                                                animation: `flowDown 3s infinite ${i * 0.5}s`,
                                            }}
                                        ></div>
                                    ))}

                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-3 h-3 rounded-full bg-white/40"
                                            style={{
                                                left: `${15 + i * 18}%`,
                                                top: `${20 + (i % 3) * 30}%`,
                                                animation: `pulse 2s infinite ${i * 0.3}s`,
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-900/40 rounded p-2">
                                <div className="text-xs text-slate-400">Context Size</div>
                                <div className="text-white font-mono text-sm">8.2 KB</div>
                            </div>
                            <div className="bg-slate-900/40 rounded p-2">
                                <div className="text-xs text-slate-400">Sources</div>
                                <div className="text-white font-mono text-sm">3+</div>
                            </div>
                            <div className="bg-slate-900/40 rounded p-2">
                                <div className="text-xs text-slate-400">Latency</div>
                                <div className="text-white font-mono text-sm">38ms</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Integration Demo */}
            <div className="container mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold text-white text-center mb-8">Easy Integration</h2>
                <div className="max-w-4xl mx-auto bg-slate-800/60 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <span className="text-slate-400 text-sm ml-2">memory-orchestration.ts</span>
                    </div>
                    <div className="p-6 font-mono text-sm">
                        <div className="text-slate-400">{/* Initialize memory orchestrator */}</div>
                        <div className="text-indigo-300">const</div>
                        <div className="text-white"> orchestrator = </div>
                        <div className="text-teal-300">new</div>
                        <div className="text-white"> xmem({'{'}</div>
                        <div className="pl-4 text-slate-300">
                            vectorStore: </div>
                        <div className="text-purple-300">chromadb</div>
                        <div className="text-slate-300">,</div>
                        <div className="pl-4 text-slate-300">
                            sessionStore: </div>
                        <div className="text-purple-300">redis</div>
                        <div className="text-slate-300">,</div>
                        <div className="pl-4 text-slate-300">
                            llmProvider: </div>
                        <div className="text-purple-300">mistral</div>
                        <div className="text-white">{'});'}</div>
                        <div className="mt-4 text-slate-400">{/* Retrieve context-aware response */}</div>
                        <div className="text-indigo-300">const</div>
                        <div className="text-white"> response = </div>
                        <div className="text-teal-300">await</div>
                        <div className="text-white"> orchestrator.query({'{'}</div>
                        <div className="pl-4 text-slate-300">
                            input: </div>
                        <div className="text-amber-300">&quot;Tell me about our previous discussion&quot;</div>
                        <div className="text-white">{'});'}</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default function LandingWithSession() {
    return (
        <SessionProvider>
            <Landing />
        </SessionProvider>
    );
}