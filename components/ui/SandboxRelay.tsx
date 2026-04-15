import React, { ReactNode } from 'react';
import { useStore, type SandboxConfigPatch } from '../../store';

interface SandboxRelayProps {
    config: SandboxConfigPatch;
    children: ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'purple';
}

export const SandboxRelay = ({ config, children, className = '', variant = 'primary' }: SandboxRelayProps) => {
    
    const baseStyle = "text-[9px] font-mono border rounded transition-all flex items-center gap-2";
    
    const variants = {
        primary: "border-arista-blue/30 text-arista-blue hover:text-white hover:bg-arista-blue/10 px-3 py-1.5",
        secondary: "border-arista-border bg-arista-bg hover:bg-white/5 text-slate-400 hover:text-white px-4 py-2",
        purple: "border-arista-purple/30 bg-arista-purple/10 text-purple-300 uppercase tracking-widest hover:bg-arista-purple/20 py-3 px-6 rounded-xl flex justify-center"
    };

    return (
        <button 
             onClick={() => {
                 const store = useStore.getState();
                 store.setSandboxConfig(config);
                 store.setActiveView('sandbox');
             }}
             className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
