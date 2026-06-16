import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../ui/Section';
import Box from 'lucide-react/dist/esm/icons/box.js';
import Server from 'lucide-react/dist/esm/icons/server.js';
import Network from 'lucide-react/dist/esm/icons/network.js';
import AlertTriangle from 'lucide-react/dist/esm/icons/triangle-alert.js';
import Search from 'lucide-react/dist/esm/icons/search.js';
import ArrowUpCircle from 'lucide-react/dist/esm/icons/circle-arrow-up.js';
import Lock from 'lucide-react/dist/esm/icons/lock.js';
import Cloud from 'lucide-react/dist/esm/icons/cloud.js';
import XCircle from 'lucide-react/dist/esm/icons/circle-x.js';
import CheckCircle from 'lucide-react/dist/esm/icons/circle-check-big.js';
import HelpCircle from 'lucide-react/dist/esm/icons/circle-question-mark.js';
import AlertOctagon from 'lucide-react/dist/esm/icons/octagon-alert.js';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw.js';
import { Jargon } from '../ui/Jargon';

type ModelType = 'meraki' | 'cisco' | 'arista';

export const ArchitecturalParadox: React.FC = () => {
  const [activeModel, setActiveModel] = useState<ModelType>('arista');
  const [interactionState, setInteractionState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleAction = (action: 'debug' | 'upgrade') => {
    setInteractionState('loading');
    setMessage(null);

    // Simulation Logic
    setTimeout(() => {
      if (activeModel === 'meraki') {
        if (action === 'debug') {
          setInteractionState('error');
          setMessage("Log unavailable. Raw packet capture requires support ticket tier 2.");
        } else {
          setInteractionState('success'); // Meraki upgrades are easy, to be fair
          setMessage("Upgrade scheduled. (Note: Firmware features may change without notice).");
        }
      } 
      else if (activeModel === 'cisco') {
        setInteractionState('error');
        if (action === 'debug') {
          setMessage("Error: DNA Center lost connectivity to WLC. Token expired.");
        } else {
          setMessage("Upgrade Failed: Matrix Check. DNAC v2.3 requires ISE v3.1 patch 4.");
        }
      } 
      else {
        setInteractionState('success');
        if (action === 'debug') {
          setMessage("Root Cause Identified: DHCP NAK from Server 10.1.1.5. (0.2s search)");
        } else {
          setMessage("Rolling Upgrade Initiated. Zero downtime. 1 AP at a time.");
        }
      }
    }, 1500);
  };

  const reset = () => {
    setInteractionState('idle');
    setMessage(null);
  };

  return (
    <Section id="paradox" title="The Operational Paradox" subtitle="Escaping the trap of 'Simple vs. Powerful'.">
      <div className="flex flex-col gap-12">
        
        {/* CONTROLS */}
        <div className="flex justify-center w-full">
            <div className="bg-arista-card border border-arista-border p-1 rounded-xl flex flex-col sm:flex-row gap-1 shadow-2xl w-full sm:w-auto">
                <button 
                    onClick={() => { setActiveModel('meraki'); reset(); }}
                    className={`px-4 py-3 sm:px-6 rounded-lg text-sm font-bold transition-all flex items-center gap-2 sm:min-w-[140px] justify-center ${activeModel === 'meraki' ? 'bg-arista-green text-black' : 'text-slate-400 hover:text-white'}`}
                >
                    <Cloud size={16} /> The Black Box
                </button>
                <button 
                    onClick={() => { setActiveModel('cisco'); reset(); }}
                    className={`px-4 py-3 sm:px-6 rounded-lg text-sm font-bold transition-all flex items-center gap-2 sm:min-w-[140px] justify-center ${activeModel === 'cisco' ? 'bg-arista-red text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    <Server size={16} /> The Stack
                </button>
                <button 
                    onClick={() => { setActiveModel('arista'); reset(); }}
                    className={`px-4 py-3 sm:px-6 rounded-lg text-sm font-bold transition-all flex items-center gap-2 sm:min-w-[140px] justify-center ${activeModel === 'arista' ? 'bg-arista-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-white'}`}
                >
                    <Network size={16} /> The Mesh
                </button>
            </div>
        </div>

        {/* MAIN STAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[500px]">
            
            {/* VISUALIZATION */}
            <div className="bg-arista-bg/50 border border-arista-border rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-8 group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05)_0_1px,transparent_1px)] bg-size-[18px_18px] opacity-5 mix-blend-overlay pointer-events-none" />
                
                <AnimatePresence mode="wait">
                    
                    {/* MERAKI VIEW */}
                    {activeModel === 'meraki' && (
                        <motion.div 
                            key="meraki"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <motion.div 
                                animate={interactionState === 'error' ? { x: [-5, 5, -5, 5, 0] } : {}}
                                className="w-48 h-48 bg-linear-to-br from-emerald-500 to-green-700 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center relative border border-white/10"
                            >
                                <Cloud size={64} className="text-white drop-shadow-lg" />
                                <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-[2px]" />
                                <div className="absolute bottom-4 text-xs font-mono text-white/80 font-bold uppercase tracking-widest">Dashboard</div>
                                <div className="absolute top-2 right-2"><Lock size={16} className="text-white/50" /></div>
                            </motion.div>
                            <div className="text-center max-w-xs">
                                <h4 className="text-white font-bold text-lg mb-2">Simplicity Tax</h4>
                                <p className="text-sm text-slate-400">Easy to look at. Impossible to look inside. When the dashboard says green but users can't connect, you hit a wall.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* CISCO VIEW */}
                    {activeModel === 'cisco' && (
                        <motion.div 
                            key="cisco"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-4 w-full max-w-md"
                        >
                            <div className="relative w-full h-64 flex flex-col items-center justify-center gap-2">
                                {/* The Stack */}
                                <motion.div animate={interactionState === 'error' ? { rotate: [-1, 1, -1, 1, 0] } : {}} className="w-40 h-12 bg-slate-800 border border-slate-600 rounded flex items-center justify-center gap-2 shadow-xl z-30">
                                    <Server size={14} className="text-blue-400" /> <span className="text-xs font-mono text-slate-300">DNA Center</span>
                                </motion.div>
                                
                                <div className="h-4 w-0.5 bg-slate-600" />
                                
                                <motion.div animate={interactionState === 'error' ? { backgroundColor: 'rgba(239,68,68,0.2)', borderColor: 'rgb(239,68,68)' } : {}} className="w-40 h-12 bg-slate-800 border border-slate-600 rounded flex items-center justify-center gap-2 shadow-xl z-20">
                                    <Lock size={14} className="text-amber-400" /> <span className="text-xs font-mono text-slate-300">ISE Policy</span>
                                </motion.div>

                                <div className="h-4 w-0.5 bg-slate-600" />

                                <motion.div animate={interactionState === 'error' ? { y: 5 } : {}} className="w-40 h-12 bg-slate-800 border border-slate-600 rounded flex items-center justify-center gap-2 shadow-xl z-10">
                                    <Box size={14} className="text-slate-400" /> <span className="text-xs font-mono text-slate-300"><Jargon term="WLC" definition="Wireless LAN Controller - the central brain that manages all the access points in legacy networks." /> 9800</span>
                                </motion.div>
                                
                                {/* Error Web */}
                                {interactionState === 'error' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <XCircle size={100} className="text-arista-red opacity-50" />
                                    </motion.div>
                                )}
                            </div>
                            <div className="text-center max-w-xs">
                                <h4 className="text-white font-bold text-lg mb-2">Integration Tax</h4>
                                <p className="text-sm text-slate-400">You spend more time managing the management tools than the network. Brittle dependencies break upgrades.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* ARISTA VIEW */}
                    {activeModel === 'arista' && (
                        <motion.div 
                            key="arista"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-6 w-full"
                        >
                             <div className="relative w-full h-64 flex items-center justify-center">
                                 {/* Central Brain? NO. Distributed Mesh. */}
                                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                     <circle cx="50%" cy="50%" r="100" fill="url(#grad1)" fillOpacity="0.1" />
                                     <defs>
                                        <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                            <stop offset="100%" stopColor="#0f1117" stopOpacity="0" />
                                        </radialGradient>
                                     </defs>
                                 </svg>

                                 {/* Nodes */}
                                 {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                                     const rad = deg * (Math.PI / 180);
                                     const x = Math.cos(rad) * 80;
                                     const y = Math.sin(rad) * 80;
                                     return (
                                         <motion.div 
                                            key={i}
                                            initial={{ scale: 0 }} animate={{ scale: 1, x, y }} 
                                            transition={{ delay: i * 0.1 }}
                                            className="absolute w-10 h-10 bg-arista-card border border-arista-blue rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)] z-10"
                                         >
                                             <Network size={18} className="text-arista-blue" />
                                             {/* Packet Simulation */}
                                             {interactionState === 'success' && (
                                                 <motion.div 
                                                    className="absolute inset-0 rounded-full border border-arista-green"
                                                    initial={{ scale: 1, opacity: 1 }}
                                                    animate={{ scale: 2, opacity: 0 }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                 />
                                             )}
                                         </motion.div>
                                     )
                                 })}
                             </div>
                             <div className="text-center max-w-xs">
                                <h4 className="text-white font-bold text-lg mb-2">Cognitive Clarity</h4>
                                <p className="text-sm text-slate-400">The Third Way. Cloud-grade visibility without the complexity tax. Single source of truth.</p>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* INTERACTION PANEL */}
            <div className="flex flex-col gap-6">
                
                <div className="bg-arista-card border border-arista-border rounded-xl p-6 flex-1">
                    <div className="flex items-center gap-2 mb-6 text-slate-500 uppercase tracking-widest text-xs font-mono font-bold">
                        <AlertOctagon size={14} /> Day 2 Operations Simulator
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={() => handleAction('debug')}
                            disabled={interactionState === 'loading'}
                            className="group flex items-center justify-between p-4 rounded-lg bg-arista-bg border border-arista-border hover:border-arista-blue hover:bg-arista-blue/5 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-md text-slate-300 group-hover:bg-arista-blue group-hover:text-white transition-colors">
                                    <Search size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white">Troubleshoot Connectivity</div>
                                    <div className="text-xs text-slate-400">Simulate a client reporting "I can't connect"</div>
                                </div>
                            </div>
                            <ArrowRightCircle />
                        </button>

                        <button 
                            onClick={() => handleAction('upgrade')}
                            disabled={interactionState === 'loading'}
                            className="group flex items-center justify-between p-4 rounded-lg bg-arista-bg border border-arista-border hover:border-arista-emerald hover:bg-arista-emerald/5 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-md text-slate-300 group-hover:bg-arista-emerald group-hover:text-white transition-colors">
                                    <RefreshCw size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white">System Upgrade</div>
                                    <div className="text-xs text-slate-400">Attempt to patch the wireless fabric</div>
                                </div>
                            </div>
                            <ArrowRightCircle />
                        </button>
                    </div>
                </div>

                {/* CONSOLE / FEEDBACK */}
                <div className="bg-black/40 border border-arista-border rounded-xl p-4 font-mono text-xs h-32 overflow-y-auto relative">
                    <div className="absolute top-2 right-2 text-slate-600 uppercase text-[9px] tracking-widest">System Log</div>
                    
                    {interactionState === 'idle' && (
                        <div className="text-slate-500 flex items-center gap-2 h-full justify-center">
                            <HelpCircle size={14} /> Waiting for input...
                        </div>
                    )}

                    {interactionState === 'loading' && (
                        <div className="text-arista-blue animate-pulse">
                            &gt; Executing task...
                        </div>
                    )}

                    {interactionState === 'error' && message && (
                        <div className="text-arista-red">
                             &gt; <span className="font-bold">FAILURE:</span> {message}
                             <br/><br/>
                             <span className="text-slate-500 text-[10px]">Trace ID: 0xDEADBEEF</span>
                        </div>
                    )}

                    {interactionState === 'success' && message && (
                        <div className="text-arista-green">
                             &gt; <span className="font-bold">SUCCESS:</span> {message}
                        </div>
                    )}
                </div>

            </div>

        </div>

      </div>
    </Section>
  );
};

const ArrowRightCircle = () => (
    <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 group-hover:border-white group-hover:text-white transition-all">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </div>
)
