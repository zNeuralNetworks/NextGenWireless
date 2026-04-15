import React, { useState } from 'react';
import { useStore } from '../store';
import { BookOpen, Layers, Menu, X, Home, Activity, Zap, LayoutGrid, Shield, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../constants';

export const Navigation: React.FC = () => {
  const { mode, toggleMode, activeSection, setActiveSection } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 h-auto hidden lg:flex flex-col items-center z-50">
        <div className="bg-arista-card/40 backdrop-blur-md border border-arista-border rounded-full py-6 px-3 shadow-2xl flex flex-col items-center gap-8">
          
          {/* Brand */}
          <div className="w-10 h-10 bg-linear-to-br from-arista-blue to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            A
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-6 relative">
            {/* Progress Line */}
            <div className="absolute left-1/2 top-4 bottom-4 w-px bg-arista-border -translate-x-1/2 z-0" />

            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className="relative group flex items-center justify-center w-8 h-8 z-10"
              >
                <div 
                  className={`w-2 h-2 rounded-full transition-all duration-300 z-10 ${
                    activeSection === item.id 
                      ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-125' 
                      : 'bg-slate-600 group-hover:bg-slate-400'
                  }`} 
                />
                <span className="absolute left-10 py-1 px-3 bg-arista-card/90 border border-arista-border rounded-md text-xs font-medium text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap backdrop-blur-md">
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* Mode Toggle */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">Persona</span>
            <button
              onClick={toggleMode}
              className={`relative w-10 h-16 rounded-full border border-arista-border p-1 transition-all duration-500 flex flex-col items-center justify-between overflow-hidden ${
                mode === 'architect' ? 'bg-arista-card shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-arista-card/50'
              }`}
              title={`Switch to ${mode === 'executive' ? 'Architect' : 'Executive'} Mode`}
            >
              {/* Active Indicator Background */}
              <div 
                className={`absolute w-8 h-7 rounded-full transition-all duration-500 ease-out z-0 ${
                  mode === 'executive' ? 'top-1 bg-white/10' : 'top-[calc(100%-2rem-4px)] bg-arista-amber/20'
                }`}
              />

              <div className={`relative z-10 p-1.5 transition-colors duration-300 ${mode === 'executive' ? 'text-white' : 'text-slate-500'}`}>
                <BookOpen size={14} />
              </div>
              <div className={`relative z-10 p-1.5 transition-colors duration-300 ${mode === 'architect' ? 'text-arista-amber' : 'text-slate-500'}`}>
                <Layers size={14} />
              </div>
            </button>
            <button
                onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('persona', mode);
                    useStore.getState().copyToClipboard(url.toString(), `${mode} view link`);
                }}
                className="mt-2 p-2 rounded-full bg-arista-card/50 border border-arista-border text-slate-400 hover:text-white hover:bg-arista-card transition-colors group relative"
                title="Share this view"
            >
                <Share2 size={14} />
                <span className="absolute left-10 py-1 px-3 bg-arista-card/90 border border-arista-border rounded-md text-xs font-medium text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap backdrop-blur-md">
                  Share View
                </span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-arista-bg/95 backdrop-blur-md border-t border-arista-border z-50 lg:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-2 py-3">
            <a 
                href="#hero" 
                onClick={() => setActiveSection('hero')}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeSection === 'hero' ? 'text-arista-blue bg-arista-blue/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Home size={20} />
                <span className="text-[9px] font-medium uppercase tracking-wider">Hero</span>
            </a>
            <a 
                href="#paradox" 
                onClick={() => setActiveSection('paradox')}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeSection === 'paradox' ? 'text-arista-amber bg-arista-amber/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Activity size={20} />
                <span className="text-[9px] font-medium uppercase tracking-wider">Paradox</span>
            </a>
            <a 
                href="#roi" 
                onClick={() => setActiveSection('roi')}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeSection === 'roi' ? 'text-arista-green bg-arista-green/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Zap size={20} />
                <span className="text-[9px] font-medium uppercase tracking-wider">ROI</span>
            </a>
            <a 
                href="#comparison" 
                onClick={() => setActiveSection('comparison')}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeSection === 'comparison' ? 'text-arista-red bg-arista-red/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <LayoutGrid size={20} />
                <span className="text-[9px] font-medium uppercase tracking-wider">Grid</span>
            </a>
            <a 
                href="#security" 
                onClick={() => setActiveSection('security')}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeSection === 'security' ? 'text-purple-400 bg-purple-400/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Shield size={20} />
                <span className="text-[9px] font-medium uppercase tracking-wider">Security</span>
            </a>
            
            {/* Mode Toggle in Bottom Nav */}
            <button
                onClick={toggleMode}
                className="flex flex-col items-center gap-1 p-2 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
            >
                {mode === 'executive' ? <BookOpen size={20} className="text-white" /> : <Layers size={20} className="text-arista-amber" />}
                <span className="text-[9px] font-medium uppercase tracking-wider">{mode === 'executive' ? 'Exec' : 'Arch'}</span>
            </button>
        </div>
      </nav>
    </>
  );
};
