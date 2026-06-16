import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../ui/Section';
import Shield from 'lucide-react/dist/esm/icons/shield.js';
import ShieldAlert from 'lucide-react/dist/esm/icons/shield-alert.js';
import Server from 'lucide-react/dist/esm/icons/server.js';
import Wifi from 'lucide-react/dist/esm/icons/wifi.js';
import User from 'lucide-react/dist/esm/icons/user.js';
import Lock from 'lucide-react/dist/esm/icons/lock.js';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import Activity from 'lucide-react/dist/esm/icons/activity.js';
import { Jargon } from '../ui/Jargon';
import { useStore } from '../../store';

export const SecurityEdge: React.FC = () => {
    const [wipsMode, setWipsMode] = useState<'legacy' | 'arista'>('legacy');
    const [userLocation, setUserLocation] = useState<number>(0); // 0, 1, 2 for AP index
    const { mode } = useStore();

    // Auto-move user for micro-segmentation demo
    useEffect(() => {
        const interval = setInterval(() => {
            setUserLocation((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Section 
            id="security" 
            title="Edge Security & Micro-segmentation" 
            subtitle="Terminate threats and enforce policies at the edge. Stop backhauling malicious traffic."
            eyebrow="ZERO TRUST ARCHITECTURE"
        >
            <div className="flex flex-col gap-16">
                
                {/* PART 1: WIPS & THREAT TERMINATION */}
                <div className="bg-arista-bg/50 border border-arista-border rounded-2xl p-6 md:p-8 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Shield className="text-arista-green" /> {mode === 'executive' ? 'Proactive Threat Containment' : <><Jargon term="WIPS" definition="Wireless Intrusion Prevention System - a security guard that constantly scans the airwaves for rogue devices and attacks." /> Deep Dive</>}
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 max-w-xl">
                                {mode === 'executive' ? 'Legacy systems allow threats to travel deep into your network before detection. Arista neutralizes threats immediately at the edge, minimizing your attack surface and protecting sensitive data.' : 'Legacy systems backhaul malicious traffic to a central controller for detection, wasting bandwidth and increasing response time. Arista APs detect and terminate threats directly at the edge.'}
                            </p>
                        </div>
                        
                        {/* Toggle */}
                        <div className="bg-arista-card border border-arista-border p-1 rounded-xl flex gap-1 shadow-2xl">
                            <button 
                                onClick={() => setWipsMode('legacy')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${wipsMode === 'legacy' ? 'bg-arista-red text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Server size={14} /> Legacy (Backhaul)
                            </button>
                            <button 
                                onClick={() => setWipsMode('arista')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${wipsMode === 'arista' ? 'bg-arista-green text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Shield size={14} /> Arista (Edge)
                            </button>
                        </div>
                    </div>

                    {/* WIPS Visualization */}
                    <div className="h-[250px] w-full bg-arista-card rounded-xl border border-arista-border relative overflow-hidden flex items-center justify-center">
                        <svg viewBox="0 0 600 200" className="w-full h-full">
                            {/* Base Infrastructure */}
                            {/* Client */}
                            <g transform="translate(50, 100)">
                                <circle r="15" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
                                <text y="30" textAnchor="middle" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">HACKER</text>
                            </g>
                            
                            {/* AP */}
                            <g transform="translate(150, 100)">
                                <rect x="-20" y="-15" width="40" height="30" rx="4" fill="#1e293b" stroke={wipsMode === 'arista' ? '#22c55e' : '#64748b'} strokeWidth="2" />
                                <text y="35" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">AP</text>
                                {wipsMode === 'arista' && (
                                    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}>
                                        <path d="M -8 -5 L 0 5 L 10 -8" fill="none" stroke="#22c55e" strokeWidth="2" />
                                    </motion.g>
                                )}
                            </g>

                            {/* Switch */}
                            <g transform="translate(300, 100)">
                                <rect x="-25" y="-15" width="50" height="30" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text y="35" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">SWITCH</text>
                            </g>

                            {/* Core/WLC */}
                            <g transform="translate(500, 100)">
                                <rect x="-30" y="-25" width="60" height="50" rx="4" fill="#1e293b" stroke={wipsMode === 'legacy' ? '#ef4444' : '#64748b'} strokeWidth="2" />
                                <text y="45" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">CORE / WLC</text>
                                {wipsMode === 'legacy' && (
                                    <text y="5" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">DETECTS</text>
                                )}
                            </g>

                            {/* Lines */}
                            <path d="M 65 100 L 130 100" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                            <path d="M 170 100 L 275 100" fill="none" stroke="#334155" strokeWidth="2" />
                            <path d="M 325 100 L 470 100" fill="none" stroke="#334155" strokeWidth="2" />

                            {/* Animated Packets */}
                            <AnimatePresence mode="wait">
                                {wipsMode === 'legacy' ? (
                                    <motion.g key="legacy-packet">
                                        {/* Malicious packet travels all the way to WLC */}
                                        <circle r="6" fill="#ef4444">
                                            <animateMotion dur="2s" repeatCount="indefinite" path="M 65 100 L 150 100 L 300 100 L 500 100" />
                                        </circle>
                                        {/* Block command travels back */}
                                        <circle r="4" fill="#3b82f6">
                                            <animateMotion dur="2s" repeatCount="indefinite" path="M 500 100 L 300 100 L 150 100" begin="1s" />
                                        </circle>
                                    </motion.g>
                                ) : (
                                    <motion.g key="arista-packet">
                                        {/* Malicious packet stopped at AP */}
                                        <circle r="6" fill="#ef4444">
                                            <animateMotion dur="1s" repeatCount="indefinite" path="M 65 100 L 130 100" />
                                            <animate attributeName="opacity" values="1;0;0" dur="1s" repeatCount="indefinite" keyTimes="0;0.9;1" />
                                        </circle>
                                        {/* Block icon at AP */}
                                        <g transform="translate(130, 100)">
                                            <circle r="8" fill="#ef4444" opacity="0.8">
                                                <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
                                            </circle>
                                            <path d="M -4 -4 L 4 4 M 4 -4 L -4 4" stroke="white" strokeWidth="2" />
                                        </g>
                                    </motion.g>
                                )}
                            </AnimatePresence>
                        </svg>
                        
                        {/* Status Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                            <div className="bg-arista-bg/80 backdrop-blur border border-arista-border p-3 rounded-lg">
                                <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Threat Resolution</span>
                                {wipsMode === 'legacy' ? (
                                    <span className="text-arista-red font-bold text-sm flex items-center gap-2"><Activity size={14}/> High Latency (Backhaul)</span>
                                ) : (
                                    <span className="text-arista-green font-bold text-sm flex items-center gap-2"><ShieldAlert size={14}/> Instant Edge Termination</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PART 2: MICRO-SEGMENTATION */}
                <div className="bg-arista-bg/50 border border-arista-border rounded-2xl p-6 md:p-8 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Lock className="text-arista-blue" /> {mode === 'executive' ? 'Zero Trust Security' : 'Micro-segmentation'}
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 max-w-xl">
                                {mode === 'executive' ? 'Security policies automatically follow users as they move, ensuring consistent protection without manual IT intervention. This drastically reduces the operational cost of maintaining secure access.' : <>Policies follow the user dynamically. No complex <Jargon term="VLAN" definition="Virtual Local Area Network - a way to logically separate different groups of devices on the same physical network." /> mapping or <Jargon term="ACL" definition="Access Control List - a set of rules that tells a network device what traffic to allow or block." /> plumbing required on the switches. The AP enforces the policy locally based on identity.</>}
                            </p>
                        </div>
                        <div className="bg-arista-blue/10 border border-arista-blue/30 text-arista-blue px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2">
                            <User size={14} /> Role: Contractor
                        </div>
                    </div>

                    <div className="h-[300px] w-full bg-arista-card rounded-xl border border-arista-border relative flex flex-col items-center justify-center p-8">
                        
                        {/* The Switch Fabric */}
                        <div className="w-full max-w-2xl h-12 bg-[#1e293b] rounded-lg border border-slate-700 flex items-center justify-center mb-16 relative">
                            <span className="text-xs font-mono text-slate-500 tracking-widest">L2 / L3 SWITCH FABRIC (NO VLAN PLUMBING)</span>
                            {/* Connection lines down to APs */}
                            <div className="absolute -bottom-16 left-[16.6%] w-px h-16 bg-slate-700" />
                            <div className="absolute -bottom-16 left-[50%] w-px h-16 bg-slate-700" />
                            <div className="absolute -bottom-16 left-[83.3%] w-px h-16 bg-slate-700" />
                        </div>

                        {/* The APs */}
                        <div className="w-full max-w-2xl flex justify-between relative">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex flex-col items-center relative w-1/3">
                                    <div className={`w-16 h-12 rounded-lg border-2 flex items-center justify-center transition-colors duration-500 ${userLocation === i ? 'bg-arista-blue/20 border-arista-blue' : 'bg-[#1e293b] border-slate-700'}`}>
                                        <Wifi size={20} className={userLocation === i ? 'text-arista-blue' : 'text-slate-500'} />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500 mt-2">AP {i + 1}</span>
                                    
                                    {/* The User & Policy Tag */}
                                    <AnimatePresence>
                                        {userLocation === i && (
                                            <motion.div 
                                                layoutId="user-policy"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                className="absolute top-20 flex flex-col items-center"
                                            >
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] z-10">
                                                    <User size={20} className="text-slate-900" />
                                                </div>
                                                
                                                {/* Policy Tag */}
                                                <div className="mt-3 bg-arista-bg border border-arista-blue/50 rounded-lg p-2 shadow-xl whitespace-nowrap">
                                                    <div className="text-[9px] text-slate-400 font-mono uppercase mb-1 border-b border-slate-700 pb-1">Dynamic Policy</div>
                                                    <div className="text-xs text-white font-bold flex items-center gap-2">
                                                        <Lock size={12} className="text-arista-blue" />
                                                        Internet Only
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </Section>
    );
};
