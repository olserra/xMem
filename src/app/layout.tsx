import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DashboardShell from '../components/layout/DashboardShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Xmem',
    description: 'Memory Orchestrator for LLMs',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
} 