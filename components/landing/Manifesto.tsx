import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { Cpu, Network, Activity, Layers, ArrowRightLeft, Radio, Database, GitCommit, Lock } from 'lucide-react';
import { Jargon } from '../ui/Jargon';
import { useStore } from '../../store';
import { GlassCard } from '../ui/GlassCard';

// --- VISUAL: Distributed Mesh vs Centralized ---
const DistributedVisual = () => (
  <div className="w-full h-full relative overflow-hidden rounded-xl bg-arista-bg/50 border border-arista-border flex items-center justify-center">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3b82f6_0%,transparent_70%)] opacity-[0.1]" />
    <svg viewBox="0 0 400 200" className="w-full h-full p-4">
      {/* Mesh Connections */}
      <path d="M 100 50 L 200 50 L 300 50 M 100 150 L 200 150 L 300 150 M 100 50 L 100 150 M 200 50 L 200 150 M 300 50 L 300 150 M 100 50 L 200 150 M 200 50 L 300 150 M 100 50 L 200 150 M 200 50 L 300 150 M 100 50 L 200 150 M 200 50 L 300 150" 
            stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.2" fill="none" />
      
      {/* Nodes */}
      {[
        {x: 100, y: 50}, {x: 200, y: 50}, {x: 300, y: 50},
        {x: 100, y: 150}, {x: 200, y: 150}, {x: 300, y: 150}
      ].map((node, i) => (
        <motion.g key={i} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}>
          <circle cx={node.x} cy={node.y} r="4" fill="#3b82f6" />
          <circle cx={node.x} cy={node.y} r="12" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" fill="none" />
          {/* Lock Icon indicating local policy */}
          <g transform={`translate(${node.x + 6}, ${node.y - 6}) scale(0.5)`}>
              <rect x="0" y="0" width="10" height="8" fill="#a855f7" />
          </g>
        </motion.g>
      ))}
      <text x="200" y="190" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace" letterSpacing="2">POLICY ENFORCED AT EDGE</text>
    </svg>
  </div>
);

// --- VISUAL: Data Plane (Local) ---
const LocalForwardingVisual = () => (
  <div className="w-full h-full relative overflow-hidden rounded-xl bg-arista-bg/50 border border-arista-border flex items-center justify-center">
    <svg viewBox="0 0 300 100" className="w-full h-full">
      {/* Switch */}
      <rect x="50" y="40" width="200" height="10" rx="2" fill="#1e293b" stroke="#475569" />
      
      {/* Traffic Flows - Short, direct paths */}
      {[80, 150, 220].map((x, i) => (
        <g key={i}>
          <path d={`M ${x} 80 L ${x} 50`} stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
          <circle r="3" fill="#10b981">
            <animateMotion dur={`${1 + i * 0.2}s`} repeatCount="indefinite" path={`M ${x} 80 L ${x} 50`} />
          </circle>
          <circle cx={x} cy="80" r="8" fill="#0f172a" stroke="#64748b" />
        </g>
      ))}
      <text x="150" y="25" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="monospace">DIRECT SWITCHING</text>
    </svg>
  </div>
);

export const Manifesto: React.FC = () => {
  const { mode } = useStore();
  const [openAccordion, setOpenAccordion] = React.useState<number>(0);

  const pillars = [
    {
      id: 0,
      icon: Lock,
      color: "text-arista-blue",
      bg: "bg-arista-blue/10",
      border: "border-arista-blue/20",
      titleExec: 'Fault Domain Isolation',
      titleArch: 'Policy & Control-Plane Locality',
      p1Exec: <>Arista Wireless is distinct because <strong className="text-white">decisions are made locally</strong>, rather than relying on a centralized control plane.</>,
      p1Arch: <>Arista Wireless is distinct because <strong className="text-white">policy enforcement happens at the AP</strong>, not in a centralized controller or a cloud look-up.</>,
      p2Exec: <>Centralized systems create global fault domains where a single outage impacts all sites. Distributing the control plane to the edge ensures your network maintains continuous forwarding and security enforcement even during <Jargon term="WAN" definition="Wide Area Network - the connection between different physical sites or to the internet." /> or cloud outages.</>,
      p2Arch: <>In controller-centric or cloud-controller <Jargon term="WLANs" definition="Wireless Local Area Networks - your Wi-Fi infrastructure." />, roaming decisions and policy checks often incur a round-trip penalty to a central brain. Arista APs hold the state locally. This means roaming is instantaneous, encryption is edge-terminated, and the system survives <Jargon term="WAN" definition="Wide Area Network - the connection between different physical sites or to the internet." /> or controller failures with zero impact to data forwarding or policy.</>,
      visual: <div className="mt-6 h-36"><DistributedVisual /></div>
    },
    {
      id: 1,
      icon: ArrowRightLeft,
      color: "text-arista-emerald",
      bg: "bg-arista-emerald/10",
      border: "border-arista-emerald/20",
      titleExec: 'Direct Data-Plane Forwarding',
      titleArch: 'Local Forwarding',
      p1Exec: <>Traffic takes the most direct path network-wide. By avoiding centralized tunnels (<Jargon term="hair-pinning" definition="When traffic goes all the way to a central controller just to be sent right back to where it started." />), application latency is structurally minimized.</>,
      p1Arch: <>Client traffic is forwarded locally at the access layer. No tunnels. No <Jargon term="hair-pinning" definition="When traffic goes all the way to a central controller just to be sent right back to where it started." />.</>,
      p2Exec: 'Scale your network linearly without the constraints of hardware controller capacity limits.',
      p2Arch: 'Network topology is no longer dictated by controller capacity.',
      visual: <div className="mt-6 h-32"><LocalForwardingVisual /></div>
    },
    {
       id: 2,
       icon: GitCommit,
       color: "text-arista-purple",
       bg: "bg-arista-purple/10",
       border: "border-arista-purple/20",
       titleExec: 'Deterministic State Changes',
       titleArch: 'Deterministic Change',
       p1Exec: 'Non-deterministic architectures carry inherent risk, where minor configuration changes can trigger widespread operational disruption.',
       p1Arch: 'Legacy controllers often suffer from "reprogramming storms" where a single config change ripples destructively across the fabric.',
       p2Exec: <>Arista ensures that <strong className="text-white">changes are programmatic and isolated</strong>. Infrastructure can be upgraded or maintained with transparent zero-downtime procedures.</>,
       p2Arch: <>Arista utilizes a state-based configuration model. Changes are computed, diffed, and applied atomically. This ensures that <strong className="text-white">behavior is deterministic</strong> during maintenance windows, rollbacks, and upgrades.</>
    },
    {
       id: 3,
       icon: Radio,
       color: "text-arista-amber",
       bg: "bg-arista-amber/10",
       border: "border-arista-amber/20",
       titleExec: 'Time-Series RF Telemetry',
       titleArch: 'RF Observability',
       p1Exec: <>We replace opaque heuristics with <strong className="text-white">deterministic, time-aligned data</strong> for absolute root-cause visibility.</>,
       p1Arch: <>We do not rely on opaque "AI" black boxes to magically fix RF. We focus on <strong className="text-white">Explainable RF</strong>.</>,
       p2Exec: 'When user experience degrades, operators have the exact forensic data required to isolate the issue, eliminating reliance on guesswork and escalating support tiers.',
       p2Arch: 'Because telemetry is streamed and time-aligned, RF events (noise spikes, channel changes) can be directly correlated with client experience scores and wired network telemetry. You see exactly <em>why</em> the system made a decision.'
    }
  ];

  return (
    <Section id="premise" eyebrow={mode === 'executive' ? "The Business Case" : "The Premise"} title={mode === 'executive' ? "Built for the Modern Enterprise" : "Next-Generation Defined"} subtitle={mode === 'executive' ? "Why Arista's architecture is the only sustainable choice for your business." : "Architecture is the only differentiator that matters."}>
      
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">

        {/* Left Col: Accordion (The 4 Pillars) */}
        <div className="flex-1 flex flex-col gap-3">
          {pillars.map((pillar) => {
             const isOpen = openAccordion === pillar.id;
             const Icon = pillar.icon;
             return (
               <div key={pillar.id} className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-2xl shadow-arista-blue/5 scale-[1.02] border-arista-blue/30' : 'hover:bg-white/5 cursor-pointer hover:scale-[1.01] pointer-events-auto border-transparent'}`} onClick={() => setOpenAccordion(pillar.id)}>
                 {/* Header */}
                 <div className="p-5 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${pillar.bg} border ${pillar.border}`}>
                            <Icon size={20} className={pillar.color} />
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{mode === 'executive' ? pillar.titleExec : pillar.titleArch}</h3>
                    </div>
                    {/* Arrow Indicator */}
                    <div className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                 </div>

                 {/* Body */}
                 <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-5 pt-0 mt-2">
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                            {mode === 'executive' ? pillar.p1Exec : pillar.p1Arch}
                        </p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            {mode === 'executive' ? pillar.p2Exec : pillar.p2Arch}
                        </p>
                        {pillar.visual && pillar.visual}
                    </div>
                 </div>
               </div>
             );
          })}
        </div>

        {/* Right Col: The Interface Layer */}
        <GlassCard padding="" className="flex-1 relative overflow-hidden rounded-xl flex flex-col group h-full min-h-[500px]">
            
            {/* Ambient Background Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-arista-blue/5 via-transparent to-arista-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-arista-blue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            {/* Content Side */}
            <div className="p-8 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-lg bg-arista-blue/10 border border-arista-blue/20">
                        <Database size={18} className="text-arista-blue" />
                    </div>
                    <span className="text-xs font-mono text-arista-blue uppercase tracking-widest font-semibold">Interface Layer</span>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                    The Interface Layer
                </h3>
                
                <p className="text-base text-slate-300 leading-relaxed max-w-xl font-light">
                    A management plane that reflects operational reality. Our <Jargon term="Management Interface" definition="CloudVision Cognitive Unified Edge - Arista's global management plane that aggregates state across the entire network." /> synthesizes distributed edge telemetry into a coherent global view, allowing operators to drill down from a site-wide anomaly to a single packet capture in three clicks.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                    {['Packet Capture', 'Client Journey', 'Root Cause Analysis'].map((tag) => (
                        <span key={tag} className="px-3 py-1.5 rounded-md bg-arista-bg border border-arista-border text-xs text-slate-400 font-mono flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Visual Side (Dashboard Simulation) */}
            <div className="flex-1 bg-arista-bg/30 border-t border-arista-border p-8 py-12 flex items-center justify-center relative">
                {/* Fake Dashboard UI */}
                <GlassCard padding="" className="w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative transform group-hover:scale-[1.05] transition-transform duration-700 ease-out">
                    {/* Header */}
                    <div className="h-8 bg-arista-bg border-b border-arista-border flex items-center px-4 gap-2 justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50" />
                        </div>
                        <div className="text-[9px] text-slate-600 font-mono tracking-wider">SYS.VIEW_01</div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="p-6 grid grid-cols-1 gap-4 relative z-10">
                        
                        {/* Row 1: State */}
                        <div className="flex items-center justify-between pb-4 border-b border-arista-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-arista-indigo/10 text-arista-indigo border border-arista-indigo/20">
                                    <Database size={16} />
                                </div>
                                <div>
                                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">State</div>
                                    <div className="text-sm text-white font-mono">Locally Distributed</div>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-arista-indigo shadow-[0_0_8px_color-mix(in_srgb,#6366f1,transparent_40%)] animate-pulse" />
                        </div>

                        {/* Row 2: Scale */}
                        <div className="flex items-center justify-between pb-4 border-b border-arista-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-arista-emerald/10 text-arista-emerald border border-arista-emerald/20">
                                    <Activity size={16} />
                                </div>
                                <div>
                                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Scale</div>
                                    <div className="text-sm text-white font-mono">Linear / Unlimited</div>
                                </div>
                            </div>
                            <div className="text-[10px] text-arista-emerald font-mono bg-arista-emerald/10 px-1.5 py-0.5 rounded">100%</div>
                        </div>

                        {/* Row 3: Design */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-arista-blue/10 text-arista-blue border border-arista-blue/20">
                                    <Network size={16} />
                                </div>
                                <div>
                                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Design</div>
                                    <div className="text-sm text-white font-mono">System-Native</div>
                                </div>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">v4.2</div>
                        </div>
                    </div>

                    {/* Subtle Grid Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05)_0_1px,transparent_1px)] bg-size-[18px_18px] opacity-5 mix-blend-overlay pointer-events-none" />
                </GlassCard>
            </div>
        </GlassCard>

      </div>
    </Section>
  );
};
