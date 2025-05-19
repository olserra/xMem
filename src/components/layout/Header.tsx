import React from 'react';
import { Brain } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="w-full h-16 bg-slate-900 text-white flex items-center justify-between px-6 shadow-md">
            <div className="flex items-center gap-3">
                <Brain size={28} className="text-teal-400" />
                <span className="font-bold text-xl">MemOrchestra</span>
            </div>
            <div className="flex items-center gap-4">
                {/* Placeholder for user/account actions */}
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                    U
                </div>
            </div>
        </header>
    );
};

export default Header; 