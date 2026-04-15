import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { Section } from '../ui/Section';
import { Network, ArrowRightLeft, Activity, Users, X, CheckCircle, AlertTriangle, RefreshCw, Server, Shield, MousePointerClick, Radio } from 'lucide-react';
import { Jargon } from '../ui/Jargon';

// --- HUD Simulation Components ---

// ARCHITECT: Linear Scale (Grid Visualization)
const LinearScaleSim = () => {
  const [apCount, setApCount] = useState(10);
  const gridCells = Array.from({ length: apCount }, (_, i) => i);
  const isLegacy = apCount > 20;

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex justify-between items-end border-b border-white/10 pb-2">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Sim.Architecture_Stress</span>
        <div className="flex items-center gap-4">
            <span className="text-xl font-mono text-white">{apCount * 50} <span className="text-sm text-slate-600">APs</span></span>
            <button 
                 onClick={() => {
                     const store = useStore.getState();
                     store.setSandboxConfig({ sandboxArchitecture: isLegacy ? 'centralized' : 'edge', sandboxAPs: Math.min(apCount * 3, 150) });
                     store.setActiveView('sandbox');
                 }}
                 className="text-[9px] font-mono border border-arista-blue/30 text-arista-blue hover:bg-arista-blue/10 px-2 py-1 rounded"
            >
                [TEST IN SANDBOX]
            </button>
        </div>
      </div>

      <div className="relative group z-20">
        <input 
          type="range" 
          min="2" max="50" step="1"
          value={apCount} 
          onChange={(e) => setApCount(parseInt(e.target.value))}
          className="w-full h-1 bg-black/50 rounded-lg appearance-none cursor-pointer accent-arista-blue relative"
        />
        <div className="flex justify-between text-[8px] text-slate-600 mt-1 font-mono">
            <span>SMALL SITE</span>
            <span>LARGE CAMPUS</span>
        </div>
      </div>
      
      <div className="flex-1 flex gap-2 overflow-hidden relative min-h-[150px]">
          
          {/* LEGACY MODEL */}
          <div className="flex-1 bg-black/40 rounded border border-white/10 p-2 flex flex-col items-center relative overflow-hidden">
             <div className="text-[8px] text-slate-500 font-mono mb-2 uppercase z-10 w-full flex justify-between">
                 <span>Legacy WLC</span>
                 <span className={isLegacy ? "text-arista-red animate-pulse" : "text-arista-amber"}>Load: {Math.min(99, apCount * 2.5).toFixed(0)}%</span>
             </div>
             <div className="flex-1 w-full relative flex items-center justify-center">
                 <motion.div 
                    animate={{ 
                        scale: 1 + (apCount / 30),
                        backgroundColor: isLegacy ? '#ef4444' : '#3b82f6',
                        boxShadow: isLegacy ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 0 0px rgba(0,0,0,0)'
                    }}
                    className="absolute z-10 w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center transition-colors duration-500"
                 >
                     <Server size={14} className="text-white" />
                 </motion.div>
                 
                 <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                    {gridCells.slice(0, 20).map((_, i) => {
                         const angle = (i / 20) * Math.PI * 2;
                         const x = 50 + Math.cos(angle) * 40;
                         const y = 50 + Math.sin(angle) * 40;
                         return (
                             <line key={i} x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`} stroke={isLegacy ? "#ef4444" : "#64748b"} strokeWidth="1" />
                         )
                    })}
                 </svg>
             </div>
             {isLegacy && (
                 <div className="absolute inset-x-0 bottom-0 bg-arista-red/20 text-[8px] font-mono p-1 text-center border-t border-arista-red/50">
                     <span className="text-arista-red font-bold animate-pulse">ERR: MEM_OVERFLOW</span><br/>
                     <span className="text-white/70">Dropping client associations...</span>
                 </div>
             )}
          </div>

          {/* SYSTEM MODEL */}
          <div className="flex-1 bg-black/40 rounded border border-white/10 p-2 flex flex-col items-center relative overflow-hidden">
             <div className="text-[8px] text-slate-500 font-mono mb-2 uppercase z-10 w-full flex justify-between">
                 <span>Arista Edge</span>
                 <span className="text-arista-green">Load: 2.1% (Flat)</span>
             </div>
             <div className="flex-1 w-full grid grid-cols-5 gap-1 content-center">
                 {gridCells.map((i) => (
                     <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-full aspect-square rounded-full bg-arista-blue/20 border border-arista-blue/50 relative"
                     >
                         {/* Mini CPU load per node */}
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-arista-blue/90 rounded-full">
                            <span className="text-[4px] text-white font-mono">2%</span>
                         </div>
                     </motion.div>
                 ))}
             </div>
             {isLegacy && (
                 <div className="absolute inset-x-0 bottom-0 text-[8px] font-mono p-1 text-center bg-arista-green/10 border-t border-arista-green/30">
                     <span className="text-arista-green font-bold">NOMINAL</span><br/>
                     <span className="text-white/70">Edge compute scaling linearly.</span>
                 </div>
             )}
          </div>

      </div>
    </div>
  );
};

// ARCHITECT: Protocol Overhead (Path Tracer)
const ProtocolOverheadSim = () => {
    const [view, setView] = useState<'tunnel' | 'native'>('tunnel');
    const [rtt, setRtt] = useState(0);

    // Simulate RTT Jitter
    useEffect(() => {
        const interval = setInterval(() => {
            if (view === 'tunnel') {
                // Highly variable, high total RTT due to hairpining
                setRtt(85 + Math.floor(Math.random() * 40) - 20); // 65ms - 105ms
            } else {
                // Ultra-low, stable RTT due to edge terminating
                setRtt(0.5 + Math.random() * 0.4); // 0.5ms - 0.9ms
            }
        }, 800);
        return () => clearInterval(interval);
    }, [view]);
    
    return (
        <div className="h-full flex flex-col p-4 relative overflow-hidden">
             <div className="flex items-center justify-between z-20 relative mb-4">
                 <div className="flex p-1 bg-black/60 rounded-lg border border-white/10">
                    {(['tunnel', 'native'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setView(p)}
                            className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md transition-all ${
                                view === p ? 'bg-white/10 text-white shadow-sm border border-white/20' : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                 </div>
                 <button 
                     onClick={() => {
                         const store = useStore.getState();
                         store.setSandboxConfig({ sandboxArchitecture: view === 'tunnel' ? 'centralized' : 'edge' });
                         store.setActiveView('sandbox');
                     }}
                     className="text-[9px] font-mono border border-arista-blue/30 text-arista-blue hover:bg-arista-blue/10 px-2 py-1 rounded"
                >
                    [TEST IN SANDBOX]
                </button>
             </div>
            
            <div className="flex-1 relative bg-black/40 rounded border border-white/10 min-h-[150px] shadow-inner">
                <svg viewBox="0 0 300 150" className="w-full h-full">
                    {/* Nodes */}
                    <g transform="translate(30, 120)">
                        <circle r="5" fill="#ffffff" />
                        <text y="15" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">CLIENT</text>
                    </g>
                    <g transform="translate(80, 120)">
                        <rect x="-10" y="-10" width="20" height="20" fill="#1e293b" stroke="#64748b" />
                        <text y="20" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">AP (EDGE)</text>
                    </g>
                    <g transform="translate(150, 70)">
                        <rect x="-15" y="-10" width="30" height="20" rx="4" fill="#1e293b" stroke="#64748b" />
                        <text y="-15" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">SWITCH</text>
                    </g>
                    <g transform="translate(250, 30)">
                        <circle r="15" fill="#1e293b" stroke="#64748b" />
                        <text y="25" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">WAN / CORE</text>
                    </g>

                    {/* Tunnel Controller Node */}
                    <AnimatePresence>
                    {view === 'tunnel' && (
                        <motion.g 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transform="translate(250, 120)"
                        >
                            <rect x="-20" y="-15" width="40" height="30" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" />
                            <text y="25" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">WLC</text>
                        </motion.g>
                    )}
                    </AnimatePresence>

                    {/* PATHS */}
                    {view === 'tunnel' ? (
                        <>
                            {/* Hairpin Path */}
                            <path d="M 30 120 L 80 120 L 150 70 L 250 120 L 150 70 L 250 30" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                            <circle r="4" fill="#ef4444">
                                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 30 120 L 80 120 L 150 70 L 250 120 L 150 70 L 250 30" />
                            </circle>
                        </>
                    ) : (
                        <>
                            {/* Direct Path */}
                            <path d="M 30 120 L 80 120 L 150 70 L 250 30" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.5" />
                            <circle r="4" fill="#06b6d4">
                                <animateMotion dur="0.8s" repeatCount="indefinite" path="M 30 120 L 80 120 L 150 70 L 250 30" />
                            </circle>
                        </>
                    )}
                </svg>

                {/* Live Instrumentation Feed */}
                <div className="absolute top-2 right-2 bg-black/80 px-3 py-2 rounded border border-white/5 shadow-xl font-mono text-[10px]">
                    <div className="text-slate-500 mb-1 border-b border-white/10 pb-1">Path Stats [L3]</div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">RTT (ms)</span>
                        <span className={view === 'tunnel' ? 'text-arista-red' : 'text-arista-cyan'}>{rtt > 0 ? rtt.toFixed(1) : '--.-'}</span>
                    </div>
                    <div className="flex justify-between gap-4 mt-1 opacity-70">
                        <span className="text-slate-400">Jitter</span>
                        <span className={view === 'tunnel' ? 'text-arista-amber' : 'text-arista-cyan'}>{view === 'tunnel' ? '28.4' : '0.1'}</span>
                    </div>
                    <div className="flex justify-between gap-4 mt-1 opacity-70">
                        <span className="text-slate-400">Drops</span>
                        <span className={view === 'tunnel' ? 'text-arista-red' : 'text-arista-green'}>{view === 'tunnel' ? '1.2%' : '0.0%'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ENGINEER: MTTI Race (Updated for RF Observability)
const MttiRaceSim = () => {
    const [step, setStep] = useState(0);

    // Auto-play the sim
    useEffect(() => {
        const interval = setInterval(() => {
            setStep((s) => (s + 1) % 4);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full flex flex-col p-4 gap-4">
             <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-500 text-center uppercase tracking-widest">
                 <span>Opaque Heuristics</span>
                 <span className="text-arista-purple">Explainable JSON</span>
             </div>

             <div className="flex-1 grid grid-cols-2 gap-4 relative min-h-[150px]">
                 {/* Legacy Box */}
                 <div className="bg-black/60 rounded border border-white/5 p-3 font-mono text-[8.5px] text-slate-400 overflow-hidden flex flex-col justify-center">
                     <div className="border-b border-white/10 pb-2 mb-2 uppercase text-slate-600">Controller CLI</div>
                     <div className="space-y-1">
                        {step > 0 && <div className="text-arista-amber line-clamp-1">{'>'} EVENT: ARM_SCAN_INIT</div>}
                        {step > 1 && <div className="text-slate-500 line-clamp-1">{'>'} INFO: Processing RF matrix...</div>}
                        {step > 2 && <div className="text-white bg-arista-red/20 px-1 line-clamp-1">{'>'} EXEC: SET CH 11 (was: 6)</div>}
                        {step === 0 && <div className="text-slate-600">Waiting for events...</div>}
                     </div>
                     <div className="mt-4 pt-2 border-t border-white/5 text-[7px] text-slate-600">
                         Root cause telemetry: <span className="text-arista-red">Unavailable in Log</span>
                     </div>
                 </div>

                 {/* Arista Syslog Feeds */}
                 <div className="bg-[#050510] rounded border border-arista-purple/20 p-2 relative shadow-inner overflow-hidden font-mono text-[8px] flex flex-col gap-1">
                     <div className="absolute inset-0 bg-linear-to-b from-arista-purple/5 to-transparent pointer-events-none" />
                     <div className="text-slate-600 mb-1 pl-1">{"{"}</div>
                     <div className={`transition-opacity pl-3 flex flex-col gap-0.5 ${step >= 0 ? 'opacity-100 text-slate-400' : 'opacity-20'}`}>
                         <span>"timestamp": "2026-04-02T15:42Z",</span>
                         <span>"type": "RF_INTERFERENCE",</span>
                         <span className="text-arista-amber">"metrics": {"{ \"noise_floor\": -85, \"snr\": 12 }"},</span>
                     </div>
                     <div className={`transition-opacity pl-3 flex flex-col gap-0.5 ${step >= 1 ? 'opacity-100 text-slate-400' : 'opacity-20'}`}>
                         <span>"type": "CLIENT_EXPERIENCE",</span>
                         <span className="text-arista-amber">"impact": "TX_RETRY_SPIKE_DETECTED",</span>
                     </div>
                     <div className={`transition-opacity pl-3 flex flex-col gap-0.5 ${step >= 2 ? 'opacity-100 text-slate-400' : 'opacity-20'}`}>
                         <span>"action_taken": "CHANNEL_SWITCH",</span>
                         <span className="text-arista-green bg-arista-green/10 px-1">"reason": "MITIGATE_NON_WIFI_NOISE"</span>
                     </div>
                     <div className="text-slate-600 mt-1 pl-1">{"}"}</div>
                 </div>
             </div>
             
             <div className="text-center text-[9px] text-slate-400">
                 Visibility: <span className="text-white">Correlated Root Cause vs Magic AI Boxes</span>
             </div>
        </div>
    )
}

// ENGINEER: Zero Downtime Upgrade
const UpgradeSim = () => {
    const [upgrading, setUpgrading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (upgrading) {
            interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        setUpgrading(false);
                        return 0;
                    }
                    return p + 2;
                });
            }, 50);
        }
        return () => { if (interval !== null) clearInterval(interval); };
    }, [upgrading]);

    return (
        <div className="h-full p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-arista-border pb-2">
                 <span className="text-[10px] font-mono text-slate-500 uppercase">Live_Upgrade.exe</span>
                 {!upgrading ? (
                     <button onClick={() => setUpgrading(true)} className="flex items-center gap-1 text-[10px] bg-arista-emerald/20 text-arista-emerald px-2 py-1 rounded hover:bg-arista-emerald hover:text-white transition-colors">
                         <RefreshCw size={10} /> START
                     </button>
                 ) : (
                    <span className="text-[10px] text-arista-emerald font-mono">{progress}%</span>
                 )}
            </div>

            <div className="flex-1 flex items-center justify-around relative min-h-[120px]">
                {/* APs */}
                {[0, 1, 2].map((i) => {
                    // Logic: Upgrade one at a time.
                    const isMyTurn = upgrading && progress > i * 33 && progress < (i + 1) * 33;
                    const isDone = upgrading && progress > (i + 1) * 33;
                    
                    return (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <motion.div 
                                animate={{ 
                                    scale: isMyTurn ? 1.2 : 1,
                                    borderColor: isMyTurn ? '#10b981' : (isDone ? '#22c55e' : '#334155')
                                }}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-arista-bg transition-colors ${!upgrading ? 'border-arista-border' : ''}`}
                            >
                                {isMyTurn ? (
                                    <RefreshCw size={14} className="text-arista-emerald animate-spin" />
                                ) : (
                                    <CheckCircle size={14} className={isDone ? 'text-arista-green' : 'text-slate-600'} />
                                )}
                            </motion.div>
                            <span className="text-xs font-mono text-slate-500">AP-0{i+1}</span>
                        </div>
                    )
                })}
            </div>

            <div className="bg-arista-bg/50 p-2 rounded border border-arista-border">
                <div className="flex justify-between text-[9px] font-mono mb-1">
                    <span className="text-slate-400">CLIENT UPTIME</span>
                    <span className="text-arista-green">100.00%</span>
                </div>
                <div className="w-full h-1 bg-arista-green/20 rounded-full overflow-hidden">
                    <div className="h-full bg-arista-green w-full" />
                </div>
            </div>
        </div>
    )
}

// ARCHITECT: Identity (Standards Based)
const IdentitySim = () => {
    const [pos, setPos] = useState(30);
    return (
        <div className="h-full flex flex-col items-center justify-center p-4 relative min-h-[200px]">
             <div className="absolute top-4 w-full flex justify-between px-8 text-[9px] font-mono text-slate-500">
                 <span>SWITCH PORT 12</span>
                 <span>WIFI AP-05</span>
             </div>
             
             {/* Network Divider */}
             <div className="absolute inset-y-0 left-1/2 w-px border-l border-dashed border-slate-700" />

             {/* Draggable User */}
             <div className="w-full relative h-12 flex items-center">
                 <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={pos} 
                    onChange={(e) => setPos(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                 />
                 
                 {/* Track */}
                 <div className="w-full h-1 bg-arista-bg rounded-full" />
                 
                 {/* User Token */}
                 <div 
                    className="absolute top-1/2 -translate-y-1/2 w-36 h-20 -ml-18 bg-arista-bg/90 backdrop-blur border border-arista-indigo/50 rounded-lg shadow-xl flex flex-col items-center justify-center pointer-events-none transition-all duration-75 z-10"
                    style={{ left: `${pos}%` }}
                 >
                     <div className="w-6 h-6 bg-arista-indigo rounded-full flex items-center justify-center text-white mb-1">
                        <Shield size={12} />
                     </div>
                     <div className="text-[8px] font-mono text-white text-center">
                        Role: Engineer<br/>
                        <span className="text-arista-indigo">EVPN/VXLAN: 10020</span>
                     </div>
                     <div className="absolute -top-2 px-1 bg-arista-card text-[6px] text-slate-400 border border-arista-border rounded">
                         STANDARDS BASED
                     </div>
                 </div>
             </div>
        </div>
    )
}

// --- MAIN SECTION ---

const cards = [
    {
        id: 'dist-control',
        title: 'Edge Intelligence',
        icon: Network,
        hook: "Why does the controller crash during high traffic?",
        stat: "UNLIMITED SCALE",
        desc: <React.Fragment>Distributed control plane means no central choke point. Every AP added increases total system <Jargon term="CPU" definition="Central Processing Unit - the brain of the device. More APs mean more brains working together." /> power.</React.Fragment>,
        color: 'text-arista-blue',
        sim: LinearScaleSim,
        detail: <React.Fragment>Access points execute <Jargon term="RF" definition="Radio Frequency - the wireless signals that connect devices to the network." /> decisions locally, maintain client state locally, and continue operating independently during upstream failures. The network scales linearly, not exponentially.</React.Fragment>
    },
    {
        id: 'native-fwd',
        title: 'Native Forwarding',
        icon: ArrowRightLeft,
        hook: "Stop hairpinning traffic across the campus.",
        stat: "ZERO TUNNELS",
        desc: <React.Fragment>Traffic follows normal <Jargon term="L2 or L3" definition="Layer 2 (switching) or Layer 3 (routing) - the standard ways data moves across a network without extra packaging." /> forwarding paths. No tunneling dependencies.</React.Fragment>,
        color: 'text-arista-cyan',
        sim: ProtocolOverheadSim,
        detail: <React.Fragment>Controller-centric designs often centralize policy state, mobility state, RF coordination, and system of record even when data can be locally bridged. That centralized dependency drives failure modes, change workflow friction, and scale complexity. Traditional <Jargon term="WLANs" definition="Wireless Local Area Networks - your Wi-Fi infrastructure." /> often depend on centralized control and can require tunneling for certain policies, mobility, or designs.</React.Fragment>
    },
    {
        id: 'telemetry',
        title: 'RF Observability',
        icon: Activity,
        hook: "Why rely on opaque heuristics and 'AI' black boxes?",
        stat: "EXPLAINABLE RF",
        desc: 'Events are first-class objects. We correlate RF noise directly to Client Experience without guessing.',
        color: 'text-arista-purple',
        sim: MttiRaceSim,
        detail: 'Traditional WLANs use "AI" as a black box to hide complexity. Arista streams telemetry continuously. Client state transitions, RF environment changes, and AP decision events are time-aligned. You see WHY the system changed channels, not just THAT it did.'
    },
    {
        id: 'upgrade',
        title: 'Zero Downtime',
        icon: RefreshCw,
        hook: "Upgrades shouldn't require night shifts.",
        stat: "HITLESS UPGRADES",
        desc: 'Patch the network at noon. The system upgrades one node at a time while neighbors cover the RF gap.',
        color: 'text-arista-emerald',
        sim: UpgradeSim,
        detail: 'No more 2:00 AM maintenance windows. The system upgrades one node at a time while neighbors cover the RF gap. Clients stay connected.'
    },
    {
        id: 'identity',
        title: 'Universal Segmentation',
        icon: Users,
        hook: "Why are VLANs tied to specific switch ports?",
        stat: "ID FOLLOWS USER",
        desc: <React.Fragment>Standards-based <Jargon term="EVPN/VXLAN" definition="A modern networking standard that allows networks to stretch across different physical locations seamlessly, keeping security policies intact." />. Security policies move with the device, not the topology.</React.Fragment>,
        color: 'text-arista-indigo',
        sim: IdentitySim,
        detail: <React.Fragment>Standard-based segmentation (<Jargon term="EVPN/VXLAN" definition="Ethernet Virtual Private Network / Virtual Extensible LAN - advanced protocols for building scalable, secure networks." />) that stretches across Wired and Wireless. Policy follows the user, not the <Jargon term="VLAN" definition="Virtual Local Area Network - a traditional way of separating network traffic." />.</React.Fragment>
    }
];

export const FiveBehaviors: React.FC = () => {
    const { mode } = useStore();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const scrollLeft = scrollRef.current.scrollLeft;
        const width = scrollRef.current.clientWidth;
        const index = Math.round(scrollLeft / width);
        setActiveIndex(index);
    };

    return (
        <Section id="behaviors" title={mode === 'executive' ? "Strategic Advantages" : "Five Core Behaviors"} subtitle={mode === 'executive' ? "How Arista's architecture translates to business value." : "Operational realities for Engineers and Architects."}>
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 scrollbar-hide"
            >
                {cards.map((card) => {
                    const isExpanded = expandedId === card.id;
                    return (
                        <motion.div
                            key={card.id}
                            layout
                            onClick={() => setExpandedId(isExpanded ? null : card.id)}
                            whileHover={!isExpanded ? { scale: 1.02, borderColor: "rgba(255,255,255,0.2)" } : {}}
                            className={`group rounded-2xl p-6 cursor-pointer relative overflow-hidden transition-all duration-500 border border-arista-border flex flex-col snap-center shrink-0 w-[85vw] md:w-auto ${
                                isExpanded 
                                    ? 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2 z-10 bg-arista-card shadow-2xl ring-1 ring-white/10 h-auto min-h-[650px]' 
                                    : 'bg-arista-card/40 hover:bg-arista-card/80 h-[300px]'
                            }`}
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            
                            {/* Header Row */}
                            <motion.div layout="position" className="flex items-start justify-between mb-4 relative z-10 w-full">
                                <div className={`p-3 rounded-xl bg-arista-bg border border-arista-border ${card.color}`}>
                                    <card.icon size={24} />
                                </div>
                                
                                {isExpanded ? (
                                    <button className="text-slate-500 hover:text-white transition-colors p-2">
                                        <X size={20} />
                                    </button>
                                ) : (
                                    <div className={`px-2 py-1 rounded bg-arista-bg/50 border border-arista-border text-[10px] font-mono font-bold tracking-tight ${card.color}`}>
                                        {card.stat}
                                    </div>
                                )}
                            </motion.div>
                            
                            {/* Content */}
                            <div className="relative z-10 flex-1 flex flex-col">
                                <motion.h3 layout="position" className="text-xl font-bold text-white mb-2">{card.title}</motion.h3>
                                
                                {/* Teaser: Hook & Desc (Collapsed Only) */}
                                {!isExpanded && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="bg-arista-bg/50 rounded-lg p-3 border-l-2 border-slate-600">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{mode === 'executive' ? 'The Business Problem' : 'The Challenge'}</p>
                                            <p className="text-sm text-slate-300 italic">"{card.hook}"</p>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
                                    </motion.div>
                                )}
                                
                                {/* Expanded Content */}
                                {isExpanded && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                                        className="flex-1 flex flex-col lg:flex-row gap-6 border-t border-arista-border pt-6 mt-2"
                                    >
                                        <div className="flex-1 space-y-4">
                                            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Mechanism of Action</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">{card.detail}</p>
                                            
                                            <div className="p-4 rounded-lg bg-arista-bg border border-arista-border mt-4">
                                                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Key Outcome</div>
                                                <div className={`text-lg font-mono font-bold ${card.color}`}>{card.stat}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-[1.5] bg-arista-bg/50 rounded-xl border border-arista-border overflow-hidden shadow-inner flex flex-col min-h-[350px]">
                                            <div className="bg-arista-card border-b border-arista-border px-3 py-2 flex items-center justify-between">
                                                <span className="text-[10px] font-mono text-slate-500 uppercase">Interactive Simulation</span>
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-arista-red/20" />
                                                    <div className="w-2 h-2 rounded-full bg-arista-amber/20" />
                                                    <div className="w-2 h-2 rounded-full bg-arista-green/20" />
                                                </div>
                                            </div>
                                            <div className="flex-1 relative cursor-default" onClick={(e) => e.stopPropagation()}>
                                                <card.sim />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            
                            {/* CTA Footer (Collapsed Only) */}
                             {!isExpanded && (
                                <div className="mt-4 pt-4 border-t border-arista-border flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-wider group-hover:text-arista-blue transition-colors">
                                    <span>Interactive Demo Inside</span>
                                    <div className="flex items-center gap-1">
                                        EXPLORE <MousePointerClick size={12} />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
            
            {/* Mobile Pagination Dots */}
            <div className="flex justify-center gap-2 mt-4 md:hidden">
                {cards.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeIndex === i ? 'bg-arista-blue' : 'bg-slate-700'}`} 
                    />
                ))}
            </div>
        </Section>
    );
};