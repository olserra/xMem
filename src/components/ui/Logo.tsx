import React from 'react';
import { MdOutlineMemory } from 'react-icons/md';

interface LogoProps {
    size?: number;
    textClassName?: string;
    iconClassName?: string;
    boldText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
    size = 28,
    textClassName = 'text-xl font-light tracking-wide bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent select-none',
    iconClassName = 'text-teal-400',
    boldText = false,
}) => (
    <span className="inline-flex items-center gap-2">
        <MdOutlineMemory size={size} className={iconClassName} />
        <span className={boldText ? `${textClassName} font-bold` : textClassName}>xMem</span>
    </span>
);

export default Logo; 