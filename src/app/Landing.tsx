'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Database, MessageSquare, Sparkles, Users, Clock, Cpu, ArrowRight } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Header from './Header';
import Footer from '../components/layout/Footer';
import SessionProviderWrapper from '../components/SessionProviderWrapper';

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
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
                    {/* Left: Headline and Pain Points */}
                    <div className="flex-1 text-center md:text-left mt-8 md:mt-0">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                            LLMs forget.<br className="hidden md:block" /> Your users notice.
                        </h2>
                        <p className="text-lg text-slate-300 mb-6 max-w-lg mx-auto md:mx-0">
                            Stop losing context and knowledge between sessions. xmem orchestrates both persistent and session memory for every LLM call—so your AI is always relevant, accurate, and up-to-date.
                        </p>
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <MessageSquare size={22} className="text-amber-400" />
                                <span className="text-slate-200 font-medium">LLM forgot your last conversation</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <Users size={22} className="text-purple-400" />
                                <span className="text-slate-200 font-medium">Lost project or team context</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <Clock size={22} className="text-teal-400" />
                                <span className="text-slate-200 font-medium">Wasting time repeating yourself</span>
                            </div>
                        </div>
                        <span
                            className="inline-block px-7 py-3 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-lg font-semibold shadow-lg select-none cursor-default mt-2"
                        >
                            Persistent memory for every user
                        </span>
                    </div>
                    {/* Right: Visual Illustration */}
                    <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full h-auto md:h-80 md:relative md:overflow-hidden">
                        {/* Fading chat bubbles (LLM) */}
                        <div className="flex flex-col gap-5 opacity-60 w-full max-w-[90vw] md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 md:gap-3 md:max-w-none">
                            <div className="bg-slate-700/70 text-slate-300 px-3 md:px-4 py-2 rounded-full shadow mb-1 animate-fadeOut text-xs md:text-base whitespace-normal break-words max-w-[90vw] md:max-w-none">&quot;Remind me what we discussed?&quot;</div>
                            <div className="bg-slate-700/50 text-slate-400 px-3 md:px-4 py-2 rounded-full shadow mb-1 animate-fadeOut delay-200 text-xs md:text-base whitespace-normal break-words max-w-[90vw] md:max-w-none">&quot;Who are you again?&quot;</div>
                            <div className="bg-slate-700/30 text-slate-500 px-3 md:px-4 py-2 rounded-full shadow animate-fadeOut delay-400 text-xs md:text-base whitespace-normal break-words max-w-[90vw] md:max-w-none">&quot;Sorry, I lost that info.&quot;</div>
                        </div>
                        {/* Persistent chat bubbles (xmem) */}
                        <div className="flex flex-col gap-5 items-end w-full max-w-[90vw] md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:gap-3 md:max-w-none">
                            <div className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-3 md:px-4 py-2 rounded-full shadow-lg font-semibold animate-pulse text-xs md:text-base whitespace-normal break-words max-w-[90vw] md:max-w-none">&quot;Welcome back, Alex!&quot;</div>
                            <div className="bg-gradient-to-r from-purple-500 to-teal-400 text-white px-3 md:px-4 py-2 rounded-full shadow-lg font-semibold animate-pulse delay-200 text-xs md:text-base whitespace-normal break-words max-w-[90vw] md:max-w-none">&quot;Here&apos;s your project summary.&quot;</div>
                            <div className="bg-gradient-to-r from-amber-400 to-teal-500 text-white px-3 md:px-4 py-2 rounded-full shadow-lg font-semibold animate-pulse delay-400 text-xs md:text-base whitespace-normal break-words max-w-[90vw] md:max-w-none">&quot;Let&apos;s pick up where you left off.&quot;</div>
                        </div>
                        {/* Decorative floating memory orbs */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute left-1/4 top-8 w-6 h-6 md:w-8 md:h-8 bg-teal-400/30 rounded-full blur-xl animate-float" />
                            <div className="absolute right-1/4 bottom-10 w-8 h-8 md:w-10 md:h-10 bg-purple-400/30 rounded-full blur-xl animate-float delay-200" />
                            <div className="absolute left-1/2 top-1/3 w-4 h-4 md:w-6 md:h-6 bg-amber-400/30 rounded-full blur-xl animate-float delay-400" />
                        </div>
                    </div>
                </div>
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

            {/* Data Flow: Animated xmem Data Flow Illustration */}
            <div className="container mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold text-white text-center mb-8">Data Flow</h2>
                <AnimatedXmemFlow />
            </div>
            {/* Benefits */}
            <div className="container mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold text-white text-center mb-8">Why xmem?</h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="group bg-gradient-to-br from-teal-500/30 via-slate-800/80 to-indigo-500/20 rounded-2xl p-6 border border-slate-700 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 opacity-20 blur-xl w-24 h-24 bg-teal-400 rounded-full animate-pulse" />
                        <Database size={32} className="text-teal-300 mb-3 drop-shadow-lg" />
                        <h3 className="text-lg font-bold text-white mb-1">Never Lose Knowledge</h3>
                        <p className="text-slate-300 text-sm">Persistent memory ensures user knowledge and context are always available.</p>
                    </div>
                    <div className="group bg-gradient-to-br from-purple-500/30 via-slate-800/80 to-indigo-500/20 rounded-2xl p-6 border border-slate-700 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 opacity-20 blur-xl w-24 h-24 bg-purple-400 rounded-full animate-pulse" />
                        <Sparkles size={32} className="text-purple-300 mb-3 drop-shadow-lg" />
                        <h3 className="text-lg font-bold text-white mb-1">Boost LLM Accuracy</h3>
                        <p className="text-slate-300 text-sm">Orchestrated context makes every LLM response more relevant and precise.</p>
                    </div>
                    <div className="group bg-gradient-to-br from-indigo-500/30 via-slate-800/80 to-teal-500/20 rounded-2xl p-6 border border-slate-700 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 opacity-20 blur-xl w-24 h-24 bg-indigo-400 rounded-full animate-pulse" />
                        <Cpu size={32} className="text-indigo-300 mb-3 drop-shadow-lg" />
                        <h3 className="text-lg font-bold text-white mb-1">Open-Source First</h3>
                        <p className="text-slate-300 text-sm">Works with any open-source LLM (Llama, Mistral, etc.) and vector DB.</p>
                    </div>
                    <div className="group bg-gradient-to-br from-amber-500/30 via-slate-800/80 to-teal-500/20 rounded-2xl p-6 border border-slate-700 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 opacity-20 blur-xl w-24 h-24 bg-amber-400 rounded-full animate-pulse" />
                        <MessageSquare size={32} className="text-amber-300 mb-3 drop-shadow-lg" />
                        <h3 className="text-lg font-bold text-white mb-1">Effortless Integration</h3>
                        <p className="text-slate-300 text-sm">Easy API and dashboard for seamless integration and monitoring.</p>
                    </div>
                </div>
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

// --- AnimatedXmemFlow Component ---

const CIRCLE_NODES = [
    {
        id: 'user',
        label: 'User',
        icon: <Users size={36} className="text-amber-400" />,
        desc: 'Sends prompt',
        color: 'from-amber-400 to-yellow-300',
    },
    {
        id: 'session',
        label: 'Session Store',
        icon: <Database size={36} className="text-purple-400" />,
        desc: 'Redis, MongoDB',
        color: 'from-purple-400 to-indigo-400',
    },
    {
        id: 'orchestrator',
        label: 'Orchestrator',
        icon: <Cpu size={48} className="text-teal-300 drop-shadow-lg" />,
        desc: '',
        color: 'from-teal-400 to-indigo-400',
    },
    {
        id: 'vector',
        label: 'Vector DB',
        icon: <Database size={36} className="text-indigo-400" />,
        desc: 'Qdrant, ChromaDB, Pinecone',
        color: 'from-indigo-400 to-purple-400',
    },
    {
        id: 'llm',
        label: 'LLM Provider',
        icon: <Sparkles size={36} className="text-teal-400" />,
        desc: 'Llama.cpp, Ollama, OpenAI',
        color: 'from-teal-400 to-amber-400',
    },
];

const CIRCLE_PATHS = [
    // [from, to, color]
    { from: 0, to: 2, color: '#fbbf24' }, // User -> Orchestrator
    { from: 2, to: 1, color: '#a78bfa' }, // Orchestrator -> Session
    { from: 2, to: 3, color: '#6366f1' }, // Orchestrator -> Vector
    { from: 2, to: 4, color: '#14b8a6' }, // Orchestrator -> LLM
    { from: 1, to: 2, color: '#a78bfa' }, // Session -> Orchestrator
    { from: 3, to: 2, color: '#6366f1' }, // Vector -> Orchestrator
    { from: 4, to: 2, color: '#14b8a6' }, // LLM -> Orchestrator
];

const CIRCLE_RADIUS = 240;
const CENTER_X = 400;
const CENTER_Y = 320;

const AnimatedXmemFlow = () => {
    const [progress, setProgress] = useState<number[]>(CIRCLE_PATHS.map(() => 0));
    const [hasMounted, setHasMounted] = useState(false);
    const rafRef = useRef<number | null>(null);
    const startRef = useRef<number | null>(null);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!hasMounted) return;
        let running = true;
        function animate(ts: number) {
            if (!startRef.current) startRef.current = ts;
            const elapsed = ts - (startRef.current as number);
            setProgress(CIRCLE_PATHS.map((_, i) => {
                // Each path animates in a loop, staggered
                const duration = 1800 + i * 200;
                const delay = i * 200;
                const t = Math.max(0, elapsed - delay);
                return (t % duration) / duration;
            }));
            if (running) rafRef.current = requestAnimationFrame(animate);
        }
        rafRef.current = requestAnimationFrame(animate);
        return () => {
            running = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            startRef.current = null;
        };
    }, [hasMounted]);

    // Get node positions in a circle
    const getNodePos = (idx: number) => {
        const angle = (2 * Math.PI * idx) / CIRCLE_NODES.length - Math.PI / 2;
        return {
            x: CENTER_X + CIRCLE_RADIUS * Math.cos(angle),
            y: CENTER_Y + CIRCLE_RADIUS * Math.sin(angle),
        };
    };

    // Get point along a straight line between two nodes
    const getLinePoint = (fromIdx: number, toIdx: number, t: number) => {
        const from = getNodePos(fromIdx);
        const to = getNodePos(toIdx);
        return {
            x: from.x + (to.x - from.x) * t,
            y: from.y + (to.y - from.y) * t,
        };
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto h-[640px] md:h-[640px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" width="800" height="640">
                {/* Draw lines between nodes */}
                {CIRCLE_PATHS.map((p, i) => {
                    const from = getNodePos(p.from);
                    const to = getNodePos(p.to);
                    return (
                        <line
                            key={`line-${i}`}
                            x1={from.x}
                            y1={from.y}
                            x2={to.x}
                            y2={to.y}
                            stroke={p.color}
                            strokeWidth={4}
                            opacity={0.18}
                            style={{ filter: `drop-shadow(0 0 8px ${p.color})` }}
                        />
                    );
                })}
                {/* Animated Orbs (client only) */}
                {hasMounted
                    ? CIRCLE_PATHS.map((p, i) => {
                        const pt = getLinePoint(p.from, p.to, progress[i]);
                        return (
                            <circle
                                key={`orb-${i}`}
                                cx={pt.x}
                                cy={pt.y}
                                r={14}
                                fill={p.color}
                                opacity={0.85}
                                style={{ filter: `drop-shadow(0 0 16px ${p.color}) blur(1px)` }}
                            />
                        );
                    })
                    // Static orbs for SSR (server only)
                    : CIRCLE_PATHS.map((p, i) => {
                        const pt = getLinePoint(p.from, p.to, 0);
                        return (
                            <circle
                                key={`orb-ssr-${i}`}
                                cx={pt.x}
                                cy={pt.y}
                                r={14}
                                fill={p.color}
                                opacity={0.85}
                                style={{ filter: `drop-shadow(0 0 16px ${p.color}) blur(1px)` }}
                            />
                        );
                    })
                }
            </svg>
            {/* Nodes in a circle */}
            {CIRCLE_NODES.map((node, i) => {
                const pos = getNodePos(i);
                return (
                    <div
                        key={node.id}
                        className={`absolute flex flex-col items-center select-none`}
                        style={{
                            left: pos.x - 48,
                            top: pos.y - 48,
                            width: 96,
                            height: 96,
                        }}
                    >
                        <div className={`bg-slate-800/70 rounded-full p-4 border-2 border-slate-700 shadow-xl mb-2 flex items-center justify-center animate-pulse`}
                            style={{ boxShadow: `0 0 24px 0 ${node.id === 'orchestrator' ? '#14b8a6' : '#0002'}` }}
                        >
                            {node.icon}
                        </div>
                        <div className="text-white font-semibold text-center text-sm leading-tight">
                            {node.label}
                        </div>
                        {node.desc && (
                            <div className="text-xs text-slate-400 font-normal text-center mt-1">{node.desc}</div>
                        )}
                    </div>
                );
            })}
            {/* Center Glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                <div className="w-40 h-40 bg-gradient-to-br from-teal-400/20 via-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse" />
            </div>
        </div>
    );
};

export default function LandingWithSession() {
    return (
        <SessionProviderWrapper>
            <Landing />
        </SessionProviderWrapper>
    );
}