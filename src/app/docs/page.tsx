'use client';
import React, { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearch } from './SearchContext';
import { sections } from './DocsSidebar';
import { docContentIndex } from './docContentIndex';

// Build a flat index of all docs from the sidebar structure
const docSummaries: Record<string, string> = {
    '/docs/get-started': 'Quick setup and first steps to use xmem in your project.',
    '/docs/api': 'Detailed documentation for all xmem API endpoints.',
    '/docs/examples': 'Code samples and integration patterns for common use cases.',
    '/docs/faq': 'Frequently asked questions and troubleshooting tips.',
    '/docs/llm-adapters': 'How to use and register LLM providers in xmem.',
    '/docs/integrations': 'How to integrate xmem with LLMs, vector stores, and session stores.',
    '/docs/memory-types': 'User, session, agent, and dual memory types in xmem.',
    '/docs/memory-operations': 'Add, search, update, and delete operations in xmem.',
    '/docs/vector-stores': 'How to use and register vector stores in xmem.',
};

function flattenSections(sections: any[]): { href: string; title: string; description: string }[] {
    const items: { href: string; title: string; description: string }[] = [];
    for (const section of sections) {
        if (section.href) {
            items.push({
                href: section.href,
                title: section.label,
                description: docSummaries[section.href] || '',
            });
        }
        if (section.children) {
            for (const child of section.children) {
                items.push({
                    href: child.href,
                    title: child.label,
                    description: docSummaries[child.href] || '',
                });
            }
        }
    }
    return items;
}

const allDocs = flattenSections(sections);

function normalize(str: string) {
    return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

function getMatchingSnippets(content: string, search: string, maxLines = 2) {
    if (!search) return [];
    const lines = content.split(/\n|(?<=[.!?])\s+/g); // split by line or sentence
    const s = normalize(search);
    const matches = lines.filter(line => normalize(line).includes(s));
    return matches.slice(0, maxLines).map(line => {
        // Highlight all occurrences of the search term (case-insensitive)
        const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, 'ig');
        return line.replace(regex, '<mark>$1</mark>');
    });
}

export default function DocsHome() {
    const { search } = useSearch();
    const [searching, setSearching] = useState(false);
    useEffect(() => { setSearching(!!search); }, [search]);
    const filtered = useMemo(() => {
        if (!search) return allDocs;
        const s = normalize(search);
        return allDocs.filter(item => {
            const content = normalize(docContentIndex[item.href] || '');
            const titleNorm = normalize(item.title);
            const descNorm = normalize(item.description);
            return (
                titleNorm.includes(s) ||
                descNorm.includes(s) ||
                content.includes(s)
            );
        });
    }, [search]);

    return (
        <div className="space-y-10">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">xmem Documentation</h1>
                <p className="text-lg text-slate-300 mb-6">Everything you need to integrate, use, and master xmem for LLM memory orchestration.</p>
            </div>
            {search ? (
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="text-slate-400 text-center py-12">No docs found for "{search}"</div>
                    ) : (
                        filtered.map(item => {
                            const content = docContentIndex[item.href] || '';
                            const snippets = getMatchingSnippets(content, search, 2);
                            return (
                                <Link key={item.href} href={item.href} className="block bg-slate-800/60 rounded-xl border border-slate-700 p-6 hover:border-teal-400 transition-colors">
                                    <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
                                    <p className="text-slate-300">{item.description}</p>
                                    {snippets.length > 0 && (
                                        <div className="mt-2 text-slate-400 text-sm">
                                            {snippets.map((snippet, i) => (
                                                <div key={i} dangerouslySetInnerHTML={{ __html: snippet }} />
                                            ))}
                                            {getMatchingSnippets(content, search, 10).length > 2 && (
                                                <div className="text-slate-500">…</div>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            );
                        })
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {allDocs.map(item => (
                        <Link key={item.href} href={item.href} className="block bg-slate-800/60 rounded-xl border border-slate-700 p-6 hover:border-teal-400 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
                            <p className="text-slate-300">{item.description}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
} 