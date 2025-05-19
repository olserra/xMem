import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DashboardShell from '../components/layout/DashboardShell';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Memory Orchestra',
    description: 'Your personal memory assistant',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <DashboardShell>{children}</DashboardShell>
            </body>
        </html>
    );
} 