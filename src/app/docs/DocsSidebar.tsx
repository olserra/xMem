'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
    { label: 'Quickstart', href: '/docs/get-started' },
    {
        label: 'Core Concepts', children: [
            { label: 'Memory Types', href: '/docs/memory-types' },
            { label: 'Memory Operations', href: '/docs/memory-operations' },
            { label: 'LLM Adapters', href: '/docs/llm-adapters' },
            { label: 'Vector Stores', href: '/docs/vector-stores' },
        ]
    },
    { label: 'API Reference', href: '/docs/api' },
    { label: 'Examples', href: '/docs/examples' },
    { label: 'Integrations', href: '/docs/integrations' },
    { label: 'FAQ', href: '/docs/faq' },
    { label: 'Contribution', href: '/docs/contribution' },
];

export default function DocsSidebar() {
    const pathname = usePathname();
    return (
        <nav className="w-56 p-4 bg-slate-900 border-r border-slate-800 min-h-screen">
            <ul className="space-y-1">
                {sections.map((section, idx) =>
                    section.children ? (
                        <li key={idx}>
                            <span className="text-xs uppercase tracking-wider text-slate-500 pl-1 mb-1 block">{section.label}</span>
                            <ul className="ml-2 pl-2 border-l border-slate-800 space-y-1">
                                {section.children.map((child, cidx) => (
                                    <li key={cidx}>
                                        <Link
                                            href={child.href}
                                            className={`block px-2 py-1 rounded text-sm transition-colors
                                                ${pathname === child.href
                                                    ? 'bg-slate-800 text-teal-400'
                                                    : 'text-slate-300 hover:bg-slate-800 hover:text-teal-300'}`}
                                        >
                                            {child.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ) : (
                        <li key={idx}>
                            <Link
                                href={section.href}
                                className={`block px-2 py-1 rounded text-sm transition-colors
                                    ${pathname === section.href
                                        ? 'bg-slate-800 text-teal-400'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-teal-300'}`}
                            >
                                {section.label}
                            </Link>
                        </li>
                    )
                )}
            </ul>
        </nav>
    );
} 