import React from 'react';

interface TerminalOutputProps {
    logs: string[];
    className?: string;
    height?: string;
    emptyMessage?: string;
    filename?: string;
}

export const TerminalOutput = ({ 
    logs, 
    className = '', 
    height = 'h-48',
    emptyMessage = 'No events.',
    filename = '/var/log/syslog'
}: TerminalOutputProps) => {
    return (
        <div
            className={`border border-white/10 rounded-xl bg-black p-4 font-mono text-[10px] md:text-xs overflow-y-auto relative ${height} ${className}`}
            aria-live="polite"
            aria-label="Simulation event log"
        >
            <div className="absolute top-2 right-2 text-[10px] text-slate-600">{filename}</div>
            <div className="flex flex-col gap-1 mt-4">
                {logs.length === 0 && <div className="text-slate-600 italic">{emptyMessage}</div>}
                
                {logs.map((log, i) => {
                    let color = 'text-slate-400'; // Default [INFO]
                    if (log.includes('CRITICAL')) color = 'text-red-500';
                    else if (log.includes('WARN')) color = 'text-amber-500';
                    
                    return (
                        <div key={i} className={color}>
                            {log}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
