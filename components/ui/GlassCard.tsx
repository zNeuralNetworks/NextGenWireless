import React, { ReactNode, HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
    padding?: string;
    intensity?: 'light' | 'medium' | 'heavy';
}

export const GlassCard = ({ 
    children, 
    className = '', 
    padding = 'p-6',
    intensity = 'medium',
    ...props 
}: GlassCardProps) => {
    
    // Map intensity to core Arista stylistic tokens
    const bgOpacity = {
        light: 'bg-arista-card/20',
        medium: 'bg-arista-card/40',
        heavy: 'bg-arista-card/80'
    }[intensity];

    return (
        <div 
            className={`${bgOpacity} backdrop-blur-md border border-arista-border rounded-xl shadow-xl ${padding} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
