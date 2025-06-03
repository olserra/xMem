import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LandingHeader from './LandingHeader'
import SessionProviderWrapper from '../components/SessionProviderWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'xmem',
    description: 'Hybrid memory for LLMs: long-term, session, and context management.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProviderWrapper>
                    <LandingHeader />
                    {children}
                </SessionProviderWrapper>
            </body>
        </html>
    );
} 