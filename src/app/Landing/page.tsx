'use client';
import Landing from '../Landing';
import { version } from '../../version';

export default function LandingPage() {
    return (
        <>
            <Landing />
            <div className="w-full text-center text-xs text-slate-400 mt-8">v{version}</div>
        </>
    );
} 