import React, { useState } from 'react';
import { useStore } from '../../store';
import Info from 'lucide-react/dist/esm/icons/info.js';
import { AnimatePresence, motion } from 'framer-motion';

interface JargonProps {
  term: string;
  definition: string;
}

export const Jargon: React.FC<JargonProps> = ({ term, definition }) => {
  const { mode } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  // In Architect mode, we just render the text normally (or maybe a subtle underline).
  // In Executive mode, we render a dotted underline and a tooltip.
  
  if (mode === 'architect') {
    return <span className="font-mono text-slate-300">{term}</span>;
  }

  return (
    <span 
      className="relative inline-flex items-center cursor-help group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <span className="border-b border-dotted border-slate-400 text-slate-200 font-medium">
        {term}
      </span>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-arista-card border border-arista-border rounded-lg shadow-xl z-50 pointer-events-none"
          >
            <div className="flex items-start gap-2">
              <Info size={14} className="text-arista-blue shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Plain English</span>
                <span className="text-xs text-slate-300 leading-relaxed">{definition}</span>
              </div>
            </div>
            {/* Triangle pointing down */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-arista-border" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-4 border-transparent border-t-arista-card" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};
