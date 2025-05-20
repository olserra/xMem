'use client';
import React from 'react';
import { Copy, Check } from 'lucide-react';

interface SimpleCodeBlockProps {
    code: string;
    language?: string;
}

// Very basic regex-based syntax highlighting for JS, Python, Bash
function highlight(code: string, language: string = 'js') {
    if (language === 'js' || language === 'javascript' || language === 'ts' || language === 'typescript') {
        // Highlight keywords, strings, comments
        return code
            .replace(/(\/\/.*)/g, '<span class="text-slate-400">$1</span>')
            .replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, '<span class="text-amber-300">$1</span>')
            .replace(/\b(const|let|var|function|return|if|else|await|new|import|from|export|class|extends|constructor|super|this|try|catch|throw|for|while|break|continue)\b/g, '<span class="text-indigo-300">$1</span>');
    }
    if (language === 'python') {
        return code
            .replace(/(#.*)/g, '<span class="text-slate-400">$1</span>')
            .replace(/("[^"]*"|'[^']*')/g, '<span class="text-amber-300">$1</span>')
            .replace(/\b(def|return|if|else|elif|for|while|import|from|as|class|try|except|with|lambda|yield|in|is|not|and|or|pass|break|continue)\b/g, '<span class="text-indigo-300">$1</span>');
    }
    if (language === 'bash' || language === 'sh') {
        return code
            .replace(/(#.*)/g, '<span class="text-slate-400">$1</span>')
            .replace(/("[^"]*"|'[^']*')/g, '<span class="text-amber-300">$1</span>')
            .replace(/\b(if|then|else|fi|for|in|do|done|echo|exit|function|case|esac|while|break|continue)\b/g, '<span class="text-indigo-300">$1</span>');
    }
    return code;
}

export default function SimpleCodeBlock({ code, language = 'js' }: SimpleCodeBlockProps) {
    const [copied, setCopied] = React.useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="relative rounded-md overflow-hidden">
            <div className="absolute right-2 top-2">
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Copy code"
                >
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
            </div>
            <pre className="bg-slate-800 text-slate-100 p-4 rounded-md overflow-x-auto text-sm font-mono">
                <code dangerouslySetInnerHTML={{ __html: highlight(code, language) }} />
            </pre>
        </div>
    );
} 