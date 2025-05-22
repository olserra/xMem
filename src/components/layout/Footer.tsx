import React from 'react';
import { MdOutlineMemory } from 'react-icons/md';
import navLinks from './navLinks';

const Footer: React.FC = () => (
    <footer className="border-t border-slate-700">
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <MdOutlineMemory size={24} className="text-teal-400" />
                    <span className="text-white font-bold text-xl">xmem</span>
                </div>
                <div className="flex gap-6 text-slate-400">
                    {navLinks.map((item) => (
                        <a key={item.label} href={item.href} className="hover:text-white transition-colors">
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
            <div className="mt-8 text-center text-slate-500 text-sm">
                2025 xmem. All rights reserved.
            </div>
        </div>
    </footer>
);

export default Footer; 