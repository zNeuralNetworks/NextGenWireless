import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../ui/Section';
import { Package, Globe, FileCode, Plug, CloudCog, Download, Activity, Truck, AlertOctagon, CheckCircle2, ArrowRight, FolderTree, Wifi, Zap, Lock, Server } from 'lucide-react';
import { AttributionTag } from '../ui/AttributionTag';
import { Jargon } from '../ui/Jargon';
import { useStore } from '../../store';
import { GlassCard } from '../ui/GlassCard';
import { SandboxRelay } from '../ui/SandboxRelay';

// --- ZTP PROCESS VISUALIZATION ---

const ZtpProcess = () => {
  const [step, setStep] = useState(0); // 0: Idle, 1: Plug, 2: Redirect, 3: Fetch, 4: Live
  const [logs, setLogs] = useState<{time: string, msg: string, color?: string}[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-play sequence when triggered
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (step > 0 && step < 4) {
      timer = setTimeout(() => setStep(s => s + 1), 3000); // 3s per step for dramatic log effect
    }
    
    // Terminal Log generation based on step
    const t = () => new Date().toISOString().split('T')[1].slice(0,-2);
    if (step === 1) {
        setLogs([
            { time: t(), msg: 'INIT Hardware Boot Sequence... [OK]' },
            { time: t(), msg: 'REQ DHCP Lease on eth0...' },
        ]);
        setTimeout(() => setLogs(prev => [...prev, { time: t(), msg: 'ACK DHCP [IP: 10.12.44.155, DNS: 8.8.8.8]' }]), 1500);
    } else if (step === 2) {
        setLogs(prev => [...prev, { time: t(), msg: 'Resolving global redirector (redirector.arista.com)...' }]);
        setTimeout(() => setLogs(prev => [...prev, { time: t(), msg: 'Establishing Mutual TLS via TPM Certificate... [SECURE]', color: 'text-arista-purple font-bold' }]), 1500);
    } else if (step === 3) {
        setLogs(prev => [...prev, { time: t(), msg: 'Redirector payload received. Homing to CV-CUE (NYC-HQ).' }]);
        setTimeout(() => setLogs(prev => [...prev, { time: t(), msg: 'Downloading Hierarchical Config Profile... [DONE]', color: 'text-arista-blue' }]), 1000);
        setTimeout(() => setLogs(prev => [...prev, { time: t(), msg: 'Validating Image Checksum (SHA-256)... [OK]' }]), 2000);
    } else if (step === 4) {
        setLogs(prev => [...prev, { time: t(), msg: 'Config Applied. Radio 1 (2.4GHz) UP. Radio 2 (5GHz) UP.', color: 'text-arista-green font-bold' }]);
    } else if (step === 0) {
        setLogs([]);
    }

    return () => { if (timer !== null) clearTimeout(timer); };
  }, [step]);

  useEffect(() => {
      if (consoleRef.current) {
          consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      }
  }, [logs]);

  const reset = () => setStep(0);
  const start = () => setStep(1);

  return (
    <GlassCard padding="p-6 lg:p-10" className="w-full relative overflow-hidden shadow-2xl">
        
        {/* HEADER / CONTROLS */}
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CloudCog className="text-arista-blue" />
                    Secure Cloud Staging
                </h3>
                <p className="text-xs text-slate-400 mt-1">Simulate the zero-touch "Ship-to-Site" sequence.</p>
            </div>
            <button 
                onClick={step === 4 ? reset : start}
                disabled={step !== 0 && step !== 4}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    step === 0 
                        ? 'bg-arista-blue text-white hover:bg-blue-600 hover:scale-105 shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                        : (step === 4 ? 'bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed')
                }`}
            >
                {step === 0 && <><Zap size={14} /> Deploy AP</>}
                {step > 0 && step < 4 && <><Activity size={14} className="animate-spin" /> Provisioning</>}
                {step === 4 && <><CheckCircle2 size={14} /> Reset Sim</>}
            </button>
        </div>

        {/* DIAGRAM LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 min-h-[300px]">
            
            {/* COLUMN 1: INTENT (CloudVision) */}
            <div className={`border rounded-xl p-4 transition-colors duration-500 bg-black/40 ${step >= 3 ? 'border-arista-green/50 shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/10'}`}>
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                    <Globe size={16} className="text-arista-blue" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Arista CloudVision</span>
                </div>
                
                {/* Hierarchical Tree Visual */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                        <FolderTree size={14} />
                        <span>Global / Org</span>
                    </div>
                    <div className="pl-4 flex flex-col gap-3 border-l border-dashed border-slate-700 ml-1.5">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                            <FolderTree size={14} />
                            <span>United States</span>
                        </div>
                        
                        {/* Target Folder */}
                        <div className={`relative p-3 rounded border transition-all duration-500 ${step >= 3 ? 'bg-arista-green/10 border-arista-green text-white shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-white/5 border-slate-700 text-slate-300'}`}>
                            <div className="flex items-center gap-2 text-xs font-bold mb-2">
                                <FolderTree size={14} className={step >= 3 ? "text-arista-green" : "text-slate-400"} />
                                <span>Site: NYC-HQ</span>
                            </div>
                            
                            {/* Inherited Policies */}
                            <div className="space-y-1.5 opacity-80">
                                <div className="flex items-center gap-2 text-[10px] font-mono">
                                    <Wifi size={10} /> SSID: Corp-Secure
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-mono">
                                    <Lock size={10} /> Policy: 802.1X
                                </div>
                            </div>

                            {/* Config Packet Flying Out */}
                            {step === 3 && (
                                <motion.div 
                                    layoutId="config-packet"
                                    className="absolute right-0 top-1/2 w-4 h-4 bg-arista-green rounded shadow-[0_0_15px_rgba(34,197,94,1)] z-50"
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* COLUMN 2: THE ETHER (Redirector) */}
            <div className="flex flex-col items-center justify-center relative">
                {/* Global Redirector Node */}
                <div className={`w-28 h-28 rounded-full border border-white/10 flex flex-col items-center justify-center text-center p-2 transition-all duration-500 z-20 ${step === 2 ? 'bg-arista-purple/10 border-arista-purple shadow-[0_0_40px_rgba(168,85,247,0.3)] scale-110' : 'bg-black/60 text-slate-600'}`}>
                    <CloudCog size={28} className={step === 2 ? "text-arista-purple animate-pulse" : ""} />
                    <span className={`text-[10px] font-bold mt-2 leading-tight ${step === 2 ? 'text-white' : ''}`}>Global Redirector</span>
                </div>

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <path d="M 150 250 L 150 150" stroke={step >= 2 ? "#a855f7" : "#334155"} strokeWidth="2" strokeDasharray="4 4" fill="none" />
                    <path d="M 150 150 L 0 150" stroke={step >= 3 ? "#22c55e" : "#334155"} strokeWidth="2" strokeDasharray="4 4" fill="none" />
                </svg>
            </div>

            {/* COLUMN 3: THE EDGE (AP) */}
            <div className="flex flex-col justify-end">
                <AnimatePresence>
                    {step >= 1 && (
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`border rounded-xl p-6 relative transition-all duration-500 bg-black/80 ${step === 4 ? 'border-arista-green shadow-[inset_0_3px_20px_rgba(34,197,94,0.2)]' : 'border-white/10'}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Server size={24} className={step === 4 ? "text-arista-green" : "text-slate-200"} />
                                    <div>
                                        <div className="text-sm font-bold text-white">AP-C360</div>
                                        <div className="text-[10px] font-mono text-slate-400">MAC: E4:5F:01:A2</div>
                                    </div>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${step === 4 ? 'bg-arista-green shadow-[0_0_10px_rgba(34,197,94,1)]' : 'bg-arista-amber animate-pulse'}`} />
                            </div>

                            <div className="space-y-2 border-t border-white/10 pt-4">
                                <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-slate-500">Config:</span>
                                    <span className={step >= 3 ? "text-white font-bold" : "text-slate-600"}>{step >= 3 ? "NYC-HQ_v2" : "Unmanaged"}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-slate-500">Uplink:</span>
                                    <span className={step >= 1 ? "text-arista-blue" : "text-slate-600"}>{step >= 1 ? "1Gbps (DHCP)" : "Down"}</span>
                                </div>
                            </div>

                            {step === 3 && (
                                <motion.div 
                                    layoutId="config-packet"
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-arista-green rounded shadow-[0_0_10px_rgba(34,197,94,1)]"
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {step === 0 && (
                     <div className="h-40 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center bg-black/20">
                        <span className="text-xs text-slate-600 font-mono uppercase tracking-widest">Awaiting Boot</span>
                     </div>
                )}
            </div>
        </div>

        {/* LIVE TERMINAL CONSOLE */}
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: step > 0 ? 1 : 0, height: step > 0 ? 120 : 0 }}
            className="mt-8 bg-black/80 border border-white/10 rounded-lg font-mono text-[10px] sm:text-xs overflow-hidden relative shadow-inner"
        >
            <div className="flex items-center px-4 py-2 border-b border-white/10 bg-white/5">
                <div className="flex gap-1.5 mr-4">
                    <div className="w-2 h-2 rounded-full bg-arista-red/30"></div>
                    <div className="w-2 h-2 rounded-full bg-arista-amber/30"></div>
                    <div className="w-2 h-2 rounded-full bg-arista-green/50"></div>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">cvp-boot.log</span>
            </div>
            <div ref={consoleRef} className="p-4 h-full overflow-y-auto no-scrollbar pb-10">
                <div className="space-y-1">
                    {logs.map((log, i) => (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="flex gap-4">
                            <span className="text-slate-500 shrink-0">[{log.time}]</span>
                            <span className={log.color || "text-slate-300"}>{log.msg}</span>
                        </motion.div>
                    ))}
                    {step > 0 && step < 4 && (
                        <div className="flex gap-4 mt-1 animate-pulse">
                            <span className="text-slate-500">[{new Date().toISOString().split('T')[1].slice(0,-2)}]</span>
                            <span className="text-slate-400">_</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>

        {/* Ambient Grid Effect */}
        <div className="absolute inset-0 bg-linear-to-br from-arista-blue/5 via-transparent to-arista-green/5 pointer-events-none mix-blend-overlay" />
        <div className="absolute top-4 right-4 z-50">
            <SandboxRelay config={{ sandboxArchitecture: 'edge' }} variant="primary" className="uppercase tracking-widest backdrop-blur-md bg-black/40">
                [Modify Logic In Sandbox]
            </SandboxRelay>
        </div>
    </GlassCard>
  );
}

// --- INTERACTIVE: Scale Simulator ---
const ScaleSim = () => {
    const [sites, setSites] = useState(10);
    const [apsPerSite, setApsPerSite] = useState(15);

    // LOGIC
    // Legacy: Staging (1 hr/site), Travel/Install Co-ord (2 hr/site), Manual Config/Verification (0.5 hr/AP)
    const legacyHours = (sites * 3) + (sites * apsPerSite * 0.5);
    // Arista: Template Config (1 hr total), Install Co-ord (0.5 hr/site), Zero Touch Verification (0)
    const aristaHours = 1 + (sites * 0.5);
    
    const saved = Math.round(legacyHours - aristaHours);
    const percent = Math.round(((legacyHours - aristaHours) / legacyHours) * 100);

    return (
        <div className="bg-arista-card/30 border border-arista-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Truck size={16} className="text-arista-amber" />
                    Rollout Complexity
                </h4>
                <div className="px-2 py-1 bg-arista-green/10 border border-arista-green/30 rounded text-[10px] text-arista-green font-mono uppercase">
                    Model: Multi-Site
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                         <div className="flex justify-between text-xs font-mono text-slate-400">
                            <span>Number of Sites</span>
                            <span className="text-white">{sites}</span>
                        </div>
                        <input 
                            type="range" min="1" max="50" step="1" value={sites} 
                            onChange={(e) => setSites(Number(e.target.value))}
                            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-arista-blue"
                        />
                    </div>
                    <div className="space-y-2">
                         <div className="flex justify-between text-xs font-mono text-slate-400">
                            <span>APs per Site</span>
                            <span className="text-white">{apsPerSite}</span>
                        </div>
                        <input 
                            type="range" min="1" max="100" step="1" value={apsPerSite} 
                            onChange={(e) => setApsPerSite(Number(e.target.value))}
                            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-arista-blue"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="text-center">
                         <div className="text-4xl font-bold text-white mb-1">{saved} <span className="text-lg text-slate-500">hrs</span></div>
                         <div className="text-xs text-slate-400 uppercase tracking-wide">Manual Touchpoints Removed</div>
                         <div className="mt-2 text-[10px] text-arista-green font-mono">{percent}% EFFICIENCY GAIN</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-arista-border/50">
                <div className="text-slate-500">
                    <span className="text-arista-red mb-1 font-bold flex items-center gap-1"><AlertOctagon size={10} /> LEGACY FRICTION</span>
                    Staging Bench • Manual Labeling • Controller Association • Onsite Troubleshooting
                </div>
                <div className="text-slate-500">
                    <span className="text-arista-green mb-1 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> ARISTA FLOW</span>
                    Drop Ship • Global Redirector • Auto-Placement • Config Inheritance
                </div>
            </div>
        </div>
    )
}

export const ZTP: React.FC = () => {
  const { mode } = useStore();
  return (
    <Section id="ztp" title={mode === 'executive' ? "Accelerated Time-to-Value" : "Zero Touch Provisioning at Scale"} subtitle={mode === 'executive' ? "Deploy thousands of sites instantly without sending IT staff on-site." : "Deploy at scale with deterministic repeatability."}>
      
      <div className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1 space-y-4">
                <p className="text-lg text-slate-300 leading-relaxed font-light">
                    {mode === 'executive' ? 'Eliminate staging costs and deployment delays. Ship hardware directly to the site and turn it on.' : 'Provisioning is not the differentiator; repeatable rollout mechanics and auditability are.'}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                    {mode === 'executive' ? <>Legacy deployments require expensive staging centers and on-site IT personnel. Arista's true <Jargon term="ZTP" definition="Zero Touch Provisioning - plugging in a device and having it configure itself automatically." /> allows you to drop-ship equipment globally. Anyone can plug it in, and it securely configures itself from the cloud in minutes.</> : <>Legacy systems often require an "install bench" to prime APs before deployment. Arista <Jargon term="ZTP" definition="Zero Touch Provisioning - plugging in a device and having it configure itself automatically." /> allows you to define <strong>Hierarchical Configuration</strong> in the cloud, ship hardware directly to the site, and let the <strong>Global Redirector</strong> handle the binding.</>}
                </p>
                <div className="p-4 bg-arista-blue/5 border border-arista-blue/20 rounded-lg">
                    <p className="text-xs text-arista-blue font-mono font-medium">
                        {mode === 'executive' ? '"Reduce deployment time by up to 90% and eliminate travel costs for branch rollouts."' : '"Configs are defined at the Folder level. APs simply inherit the intent of the location they are plugged into."'}
                    </p>
                </div>
            </div>
            <div className="lg:col-span-2 flex items-center">
                 <ZtpProcess />
            </div>
        </div>
      </div>

      <ScaleSim />

    </Section>
  );
};