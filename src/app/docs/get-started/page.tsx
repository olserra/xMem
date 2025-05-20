'use client';
import React from 'react';
import SimpleCodeBlock from '../../../components/SimpleCodeBlock';

export default function GetStarted() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-4">Get Started with xmem</h1>
            <p className="text-slate-300 mb-6">Follow these steps to integrate xmem into your LLM application.</p>
            <ol className="list-decimal list-inside space-y-6 text-slate-200">
                <li>
                    <strong>Install xmem and dependencies</strong>
                    <div className="mt-2">
                        <SimpleCodeBlock code={`npm install xmem chromadb redis`} language="bash" />
                    </div>
                </li>
                <li>
                    <strong>Initialize the orchestrator</strong>
                    <div className="mt-2">
                        <SimpleCodeBlock code={`const orchestrator = new xmem({
  vectorStore: 'chromadb',
  sessionStore: 'redis',
  llmProvider: 'mistral'
});`} language="js" />
                    </div>
                </li>
                <li>
                    <strong>Make your first API call</strong>
                    <div className="mt-2">
                        <SimpleCodeBlock code={`const response = await orchestrator.query({
  query: 'What is xmem?',
  sessionId: 'demo-session'
});`} language="js" />
                    </div>
                </li>
            </ol>
        </div>
    );
} 