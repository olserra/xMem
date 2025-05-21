'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSearch } from '@/app/docs/SearchContext';
import { sections } from '@/app/docs/DocsSidebar';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

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

export default function SearchBar({ value, onChange }: SearchBarProps) {
    const [placeholder, setPlaceholder] = useState('Search docs…   ⌘K / Ctrl+K');
    const [showModal, setShowModal] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    const searchCtx = useSearch();
    const filtered = value
        ? allDocs.filter(item =>
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.description.toLowerCase().includes(value.toLowerCase())
        )
        : [];

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const v = e.target.value;
        onChange(v);
        if (v) setShowModal(true);
        else setShowModal(false);
        setHighlighted(0);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!showModal) return;
        if (e.key === 'Escape') {
            setShowModal(false);
        } else if (e.key === 'ArrowDown') {
            setHighlighted(h => Math.min(h + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            setHighlighted(h => Math.max(h - 1, 0));
        } else if (e.key === 'Enter' && filtered[highlighted]) {
            window.location.href = filtered[highlighted].href;
            setShowModal(false);
        }
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        setTimeout(() => setShowModal(false), 100); // allow click
        if (!value) setPlaceholder('Search docs…   ⌘K / Ctrl+K');
    }

    return (
        <div className="flex items-center w-full relative">
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                onFocus={() => { setPlaceholder(''); if (value) setShowModal(true); }}
                onBlur={handleBlur}
                className="w-[48rem] px-4 py-2 rounded-md bg-slate-800 text-slate-100 placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all text-base shadow-sm"
                style={{ textAlign: 'left' }}
                aria-label="Search documentation"
                autoComplete="off"
            />
            {showModal && filtered.length > 0 && (
                <div className="absolute left-0 top-12 z-50 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                    {filtered.map((item, idx) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`block px-6 py-4 border-b border-slate-100 last:border-b-0 transition-colors ${highlighted === idx ? 'bg-teal-50' : 'bg-white'} hover:bg-teal-100`}
                            tabIndex={-1}
                            onMouseEnter={() => setHighlighted(idx)}
                            onClick={() => setShowModal(false)}
                        >
                            <div className="font-semibold text-slate-900 text-lg">{item.title}</div>
                            <div className="text-slate-600 text-sm mt-1">{item.description}</div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
} 