import React from 'react';

export default function UserAvatar({ user, isOnline, size = 'md' }) {
    if (!user) return null;

    const sizeClasses = {
        sm: 'w-7 h-7 text-xs',
        md: 'w-9 h-9 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '??';

    // Generate consistent color based on user name
    const colors = [
        'from-sky-400 to-indigo-500',
        'from-blue-400 to-cyan-500',
        'from-emerald-400 to-teal-500',
        'from-amber-400 to-orange-500',
        'from-pink-400 to-rose-500',
        'from-indigo-400 to-blue-500',
    ];
    const colorIndex = user.name ? user.name.charCodeAt(0) % colors.length : 0;

    return (
        <div className="relative inline-block group">
            <div
                className={`
                    ${sizeClasses[size]} rounded-lg bg-gradient-to-br ${colors[colorIndex]} 
                    text-white flex items-center justify-center font-bold select-none 
                    shadow-sm group-hover:shadow-md transition-all duration-200 
                    group-hover:scale-110 cursor-pointer
                `}
                title={user.name}
            >
                {initials}
            </div>
            {isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 block w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white shadow-sm animate-pulse-slow" />
            )}
        </div>
    );
}
