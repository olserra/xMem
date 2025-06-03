import React from 'react';
// import { MdOutlineMemory } from 'react-icons/md';
// import navLinks from './navLinks';
import Logo from '../ui/Logo';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa6';
import { version } from '../../version';
import Image from 'next/image';

const footerLinks = [
    {
        title: 'Product',
        links: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'API', href: '#' },
            { label: 'Docs', href: '#' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Contact', href: '#' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy', href: '#' },
            { label: 'Terms', href: '#' },
        ],
    },
];

const productHuntLink = 'https://www.producthunt.com/posts/xmem';
const githubLink = 'https://github.com/olserra/xmem';

const socialLinks = [
    { icon: <FaGithub />, href: githubLink, label: 'GitHub' },
    { icon: <FaTwitter />, href: 'https://twitter.com/', label: 'Twitter' },
    { icon: <FaDiscord />, href: 'https://discord.gg/SPGpcqA2', label: 'Discord' },
];

const year = 2024; // Use a static year to avoid hydration mismatch

const Footer: React.FC = () => (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-0">
                {/* Brand & Social */}
                <div className="flex flex-col items-start gap-4 md:w-1/3">
                    <Logo size={32} />
                    <span className="text-xs text-slate-500 mt-1 mb-2 text-left max-w-xs">
                        Hybrid memory for LLMs: long-term, session, and context management.
                    </span>
                    <div className="flex flex-col items-start gap-4">
                        <div className="flex flex-row gap-4">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.label}
                                    className="text-slate-500 hover:text-white transition-colors text-xl"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Navigation Columns */}
                <div className="flex flex-col sm:flex-row gap-8 md:gap-16 md:w-2/3 justify-end">
                    {footerLinks.map((section) => (
                        <div key={section.title} className="min-w-[120px]">
                            <div className="text-slate-300 font-semibold mb-3 text-sm tracking-wide uppercase">
                                {section.title}
                            </div>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="hover:text-white transition-colors text-base"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col md:flex-row md:justify-between items-center text-slate-500 text-xs gap-2">
                <span>&copy; {year} xmem. All rights reserved.</span>
                <span className="text-slate-600 md:text-right">v{version}</span>
            </div>
        </div>
    </footer>
);

export default Footer; 