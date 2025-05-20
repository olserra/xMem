// this avatar component will be used to display the user's avatar, with google image, rounded, in the landing page header, and also in the header of the dashboard and using IMage from Nextjs
import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface AvatarProps {
    imageUrl?: string;
    alt?: string;
    name?: string;
    size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, alt = 'User avatar', name = '', size = 40 }) => {
    const initials = name
        ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';
    return (
        <div className="flex items-center">
            <span className="mr-2 flex items-center justify-center">
                <ChevronDown size={size * 0.4} className="text-slate-400" />
            </span>
            <div
                className="rounded-full bg-slate-700 flex items-center justify-center overflow-hidden"
                style={{ width: size, height: size }}
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={alt}
                        width={size}
                        height={size}
                        className="object-cover w-full h-full rounded-full"
                        priority
                    />
                ) : (
                    <span className="text-white font-bold text-lg">{initials}</span>
                )}
            </div>
        </div>
    );
};

export default Avatar;
