import React from 'react';
import Link from 'next/link';

export default function DocsHome() {
    return (
        <div className="space-y-10">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">xmem Documentation</h1>
                <p className="text-lg text-slate-300 mb-6">Everything you need to integrate, use, and master xmem for LLM memory orchestration.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/docs/get-started" className="block bg-slate-800/60 rounded-xl border border-slate-700 p-6 hover:border-teal-400 transition-colors">
                    <h2 className="text-xl font-semibold text-white mb-2">Get Started</h2>
                    <p className="text-slate-300">Quick setup and first steps to use xmem in your project.</p>
                </Link>
                <Link href="/docs/api" className="block bg-slate-800/60 rounded-xl border border-slate-700 p-6 hover:border-teal-400 transition-colors">
                    <h2 className="text-xl font-semibold text-white mb-2">API Reference</h2>
                    <p className="text-slate-300">Detailed documentation for all xmem API endpoints.</p>
                </Link>
                <Link href="/docs/examples" className="block bg-slate-800/60 rounded-xl border border-slate-700 p-6 hover:border-teal-400 transition-colors">
                    <h2 className="text-xl font-semibold text-white mb-2">Examples</h2>
                    <p className="text-slate-300">Code samples and integration patterns for common use cases.</p>
                </Link>
                <Link href="/docs/faq" className="block bg-slate-800/60 rounded-xl border border-slate-700 p-6 hover:border-teal-400 transition-colors">
                    <h2 className="text-xl font-semibold text-white mb-2">FAQ</h2>
                    <p className="text-slate-300">Frequently asked questions and troubleshooting tips.</p>
                </Link>
                <Link href="/docs/llm-adapters" className="block bg-slate-800/60 rounded-xl border border-slate-700 p-6 hover:border-teal-400 transition-colors">
                    <h2 className="text-xl font-semibold text-white mb-2">LLM Adapters</h2>
                    <p className="text-slate-300">How to use and register LLM providers in xmem.</p>
                </Link>
            </div>
        </div>
    );
} 