import { ReactNode } from 'react';

interface DocLayoutProps {
    children: ReactNode;
}

export function DocLayout({ children }: DocLayoutProps) {
    return (
        <div className="prose prose-gray max-w-none">
            {children}
        </div>
    );
} 