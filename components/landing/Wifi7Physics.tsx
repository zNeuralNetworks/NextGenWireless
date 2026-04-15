import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../ui/Section';
import { Activity, Radio, MoveRight, Layers, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Jargon } from '../ui/Jargon';
import { useStore } from '../../store';

export const Wifi7Physics = () => {
  const { mode } = useStore();
  const [activeStandard, setActiveStandard] = useState<'wifi6' | 'wifi7'>('wifi6');
  
  // Animation triggers
  const [packetDrop, setPacketDrop] = useState(false);
  const [latency, setLatency] = useState(45);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStandard === 'wifi6') {
        interval = setInterval(() => {
            // Simulate random spikes and drops
            setLatency(150 + Math.random() * 300);
            setPacketDrop(Math.random() > 0.6);
        }, 800);
    } else {
        interval = setInterval(() => {
            // MLO rock solid
            setLatency(1 + Math.random() * 2);
            setPacketDrop(false);
        }, 500);
    }
    return () => clearInterval(interval);
  }, [activeStandard]);

  return (
    <Section id="wifi7" className="bg-[#0b0c10] relative overflow-hidden" title="The Wi-Fi 7 Physics">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-arista-purple/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-12">
        
        {/* Header Text */}
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Predictability Over <span className="text-transparent bg-clip-text bg-linear-to-r from-arista-purple to-purple-400">Peak Speeds</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            {mode === 'executive' 
              ? "Speed doesn't matter if the connection drops. Wi-Fi 7 guarantees sub-millisecond determinism for zero-drop voice calls, autonomous warehouse robotics, and latency-sensitive life science labs."
              : "4K-QAM and 320MHz channels provide peak bandwidth, but high-density environments usually crash under interference, not lack of speed. The true upgrade is Multi-Link Operation (MLO)."}
          </p>
        </div>

        {/* The Simulation Board */}
        <div className="bg-arista-card/40 backdrop-blur-md rounded-2xl border border-arista-border p-6 md:p-12 relative flex flex-col gap-8 shadow-2xl">
            
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2">Constraint Environment</h3>
                    <div className="flex items-center gap-3">
                        <Activity size={18} className="text-red-500" />
                        <span className="text-slate-300 font-bold">Heavy Spectrum Congestion</span>
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-mono border border-red-500/20">Interference: High</span>
                    </div>
                </div>

                <div className="flex p-1 bg-black/60 rounded-lg border border-white/10 shrink-0">
                    <button 
                        onClick={() => setActiveStandard('wifi6')}
                        className={`px-6 py-2 text-xs font-mono uppercase tracking-wider rounded-md transition-all ${
                            activeStandard === 'wifi6' ? 'bg-white/10 text-white shadow-sm border border-white/20' : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        Legacy Wi-Fi 6
                    </button>
                    <button 
                        onClick={() => setActiveStandard('wifi7')}
                        className={`px-6 py-2 text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-2 ${
                            activeStandard === 'wifi7' ? 'bg-arista-purple/20 text-purple-300 shadow-sm border border-arista-purple/30' : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        <Layers size={14} /> Wi-Fi 7 (MLO)
                    </button>
                </div>
            </div>

            {/* Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[250px]">
                
                {/* Left: The Graph */}
                <div className="relative h-48 flex items-center justify-center">
                    {/* The AP */}
                    <div className="absolute left-0 flex flex-col items-center">
                        <div className={`p-4 rounded-xl border z-10 bg-arista-bg border-white/10`}>
                            <Radio size={32} className="text-white" />
                        </div>
                        <span className="mt-2 text-[10px] font-mono text-slate-500">Access Point</span>
                    </div>

                    {/* The Links */}
                    <div className="w-full h-full relative z-0 flex items-center">
                        {activeStandard === 'wifi6' ? (
                            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-transparent relative">
                                {/* Congestion Block */}
                                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-8 bg-red-500/30 rounded border border-red-500/50 backdrop-blur flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                    <AlertOctagon size={14} className="text-red-500 animate-pulse" />
                                </div>
                                {/* Packet */}
                                {!packetDrop && (
                                    <motion.div 
                                        initial={{ left: "10%" }} animate={{ left: "90%" }} transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" 
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full relative flex flex-col justify-center">
                                {/* 5GHz Link (Congested) */}
                                <div className="w-full h-px bg-red-500/30 relative top-[-20px]">
                                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-6 bg-red-500/20 rounded border border-red-500/30 flex items-center justify-center">
                                        <span className="text-[8px] font-mono text-red-500">5GHz NOISE</span>
                                    </div>
                                    <span className="absolute left-1/4 -top-4 text-[8px] font-mono text-slate-600">5GHz</span>
                                </div>
                                
                                {/* 6GHz Link (Clear) */}
                                <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-transparent relative top-[20px]">
                                    <span className="absolute left-1/4 -top-4 text-[8px] font-mono text-purple-400">6GHz</span>
                                    <motion.div 
                                        initial={{ left: "10%" }} animate={{ left: "90%" }} transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* The Client */}
                    <div className="absolute right-0 flex flex-col items-center">
                        <div className={`p-4 rounded-xl border z-10 bg-arista-bg ${packetDrop ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/10'}`}>
                            <MoveRight size={32} className={packetDrop ? 'text-red-500' : 'text-slate-400'} />
                        </div>
                        <span className="mt-2 text-[10px] font-mono text-slate-500 text-center">Autonomous<br/>Robotics Client</span>
                    </div>
                </div>

                {/* Right: The Impact Logic */}
                <div className="flex flex-col justify-center gap-6">
                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${activeStandard === 'wifi6' && packetDrop ? 'bg-red-500/10 border-red-500' : 'bg-black/40 border-white/5'}`}>
                        <span className="text-xs font-mono text-slate-500">Current Latency (RTT)</span>
                        <span className={`text-xl font-mono ${activeStandard === 'wifi6' ? 'text-red-400' : 'text-arista-green'}`}>
                            {latency.toFixed(1)}ms
                        </span>
                    </div>
                    <div className={`p-4 rounded-xl border transition-colors bg-black/40 ${activeStandard === 'wifi7' ? 'border-purple-500/30' : 'border-white/5'}`}>
                        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            {activeStandard === 'wifi6' ? <AlertOctagon size={14} className="text-red-500" /> : <CheckCircle2 size={14} className="text-arista-green" />}
                            {activeStandard === 'wifi6' ? 'Single Link Failure' : 'Multi-Link Redundancy'}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {activeStandard === 'wifi6' 
                                ? "In Wi-Fi 6, the client is locked to a single band (e.g. 5GHz). When a radar blast or dense crowd inflates the noise floor, the robotic client drops packets, causing it to freeze on the warehouse floor."
                                : "With MLO (Multi-Link Operation), the client connects across 5GHz and 6GHz simultaneously. When 5GHz gets congested, packets naturally flow over the pristine 6GHz link instantly, maintaining sub-ms determinism."}
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => {
                            const store = useStore.getState();
                            store.setSandboxConfig({ sandboxStandard: 'wifi7', sandboxInterference: 'high' });
                            store.setActiveView('sandbox');
                        }}
                        className="mt-2 py-3 rounded-xl border border-arista-purple/30 bg-arista-purple/10 text-purple-300 font-mono text-xs uppercase tracking-widest hover:bg-arista-purple/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Layers size={14} /> [Model Constraints In Sandbox]
                    </button>
                </div>

            </div>
        </div>
      </div>
    </Section>
  );
};
