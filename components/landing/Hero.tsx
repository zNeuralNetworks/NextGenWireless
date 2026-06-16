import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { Section } from '../ui/Section';
import Network from 'lucide-react/dist/esm/icons/network.js';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check.js';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import XCircle from 'lucide-react/dist/esm/icons/circle-x.js';
import AlertTriangle from 'lucide-react/dist/esm/icons/triangle-alert.js';
import Zap from 'lucide-react/dist/esm/icons/zap.js';
import Server from 'lucide-react/dist/esm/icons/server.js';
import Activity from 'lucide-react/dist/esm/icons/activity.js';
import { Jargon } from '../ui/Jargon';

// --- SUB-COMPONENTS: VISUAL DIAGRAMS ---

const BottleneckDiagram = ({ mode }: { mode: 'executive' | 'architect' }) => (
  <div className="w-full h-[300px] bg-arista-card/30 rounded-xl border border-arista-red/20 relative overflow-hidden mt-8 backdrop-blur-sm">
    {/* Grid Background */}
    <div className="absolute inset-0 bg-[linear-gradient(#ef4444_1px,transparent_1px),linear-gradient(90deg,#ef4444_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_at_center,black,transparent)] opacity-[0.05]" />
    
    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-arista-red/10 border border-arista-red/30 text-arista-red text-[10px] font-mono tracking-widest uppercase">
        <Zap size={12} className="animate-pulse" />
        High Latency
    </div>

    <svg viewBox="0 0 600 300" className="w-full h-full p-4" preserveAspectRatio="xMidYMid meet">
       <defs>
         <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
           <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
           <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
         </filter>
       </defs>

       {/* Styles for auto-animation */}
       <style>
           {`
               @keyframes flowSlow {
                   0% { offset-distance: 0%; opacity: 0; }
                   10% { opacity: 1; }
                   40% { offset-distance: 40%; } /* Queue at WLC */
                   60% { offset-distance: 45%; } /* Slow processing */
                   100% { offset-distance: 100%; opacity: 0; }
               }
               @keyframes pulseRed {
                   0% { r: 35; opacity: 0.2; }
                   50% { r: 45; opacity: 0; }
                   100% { r: 35; opacity: 0.2; }
               }
               @keyframes shakeLine {
                   0% { transform: translate(0,0); }
                   25% { transform: translate(1px, 1px); }
                   50% { transform: translate(-1px, -1px); }
                   75% { transform: translate(-1px, 1px); }
                   100% { transform: translate(0,0); }
               }
           `}
       </style>

       {/* Core Network */}
       <g transform="translate(300, 40)">
          <rect x="-100" y="-15" width="200" height="30" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <text x="0" y="5" textAnchor="middle" fill="#94a3b8" fontSize="10" letterSpacing="2" fontFamily="monospace">CORE</text>
       </g>

       {/* The Bottleneck (WLC) */}
       <g transform="translate(300, 120)">
            {/* Strain Pulse */}
            <circle cx="0" cy="0" fill="#ef4444" className="animate-[pulseRed_2s_infinite]" />
            
            {/* Box */}
            <rect x="-50" y="-25" width="100" height="50" rx="4" fill="#1e293b" stroke="#ef4444" strokeWidth="2" filter="url(#glow-red)" />
            <text x="0" y="-5" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">{mode === 'executive' ? 'Controller' : 'WLC'}</text>
            {mode === 'architect' && <text x="0" y="15" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">CPU 98%</text>}
 
            {/* Backlog Dots */}
            {mode === 'architect' ? (
                <>
                    <circle cx="-60" cy="0" r="3" fill="#ef4444"><animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" /></circle>
                    <circle cx="-70" cy="0" r="3" fill="#ef4444" fillOpacity="0.7"><animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.2s" repeatCount="indefinite" /></circle>
                    <circle cx="-80" cy="0" r="3" fill="#ef4444" fillOpacity="0.4"><animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.4s" repeatCount="indefinite" /></circle>
                </>
            ) : (
                <text x="-80" y="5" fill="#ef4444" fontSize="10" fontWeight="bold">QUEUE...</text>
            )}
       </g>

       {/* APs and Tunnels */}
       {[150, 300, 450].map((x, i) => (
           <g key={i}>
               {/* Shaking Tunnel */}
               <path 
                 d={`M ${x} 260 C ${x} 200, 300 200, 300 145`} 
                 fill="none" 
                 stroke="#ef4444" 
                 strokeWidth="1" 
                 strokeDasharray="4 4" 
                 className="animate-[shakeLine_0.2s_infinite]"
                 strokeOpacity="0.6"
               />
               
               {/* Slow Packets */}
               <circle r="4" fill="#ef4444">
                   <animateMotion 
                     dur="3s"
                     repeatCount="indefinite" 
                     path={`M ${x} 260 C ${x} 200, 300 200, 300 145 C 300 200, 450 200, 450 260`}
                     keyTimes="0; 0.4; 0.6; 1"
                     keyPoints="0; 0.45; 0.55; 1" 
                     calcMode="linear"
                     begin={`${i * 0.8}s`}
                   />
               </circle>
 
               {/* AP Node */}
               <g transform={`translate(${x}, 260)`}>
                   <circle r="15" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                   <text x="0" y="30" textAnchor="middle" fill="#64748b" fontSize="10">AP-{i+1}</text>
               </g>
           </g>
       ))}
    </svg>
  </div>
);

const RoamingDiagram = ({ mode }: { mode: 'executive' | 'architect' }) => (
    <div className="w-full h-[300px] bg-arista-card/30 rounded-xl border border-arista-blue/20 relative overflow-hidden mt-8 backdrop-blur-sm group">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(#3b82f6_1px,transparent_1px),linear-gradient(90deg,#3b82f6_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_at_center,black,transparent)] opacity-[0.05]" />
      
      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-arista-blue/10 border border-arista-blue/30 text-arista-blue text-[10px] font-mono tracking-widest uppercase">
          <Network size={12} className="animate-pulse" />
          Zero-Latency Roaming
      </div>
  
      <svg viewBox="0 0 600 300" className="w-full h-full p-4" preserveAspectRatio="xMidYMid meet">
         <defs>
           <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
             <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
           </filter>
         </defs>
         
         <style>
             {`
                @keyframes clientPos {
                    0% { transform: translate(150px, 220px); }
                    40% { transform: translate(280px, 220px); }
                    50% { transform: translate(300px, 220px); }
                    60% { transform: translate(320px, 220px); }
                    100% { transform: translate(450px, 220px); }
                }

                @keyframes lineFollow {
                    0% { x1: 150px; y1: 220px; x2: 150px; y2: 80px; stroke: #64748b; stroke-opacity: 0.5; }
                    40% { x1: 280px; y1: 220px; x2: 150px; y2: 80px; stroke: #f59e0b; stroke-opacity: 0.8; }
                    49% { stroke-opacity: 0; }
                    50% { x1: 300px; y1: 220px; x2: 450px; y2: 80px; stroke: #22c55e; stroke-opacity: 1; stroke-width: 3; }
                    51% { stroke-opacity: 1; }
                    60% { x1: 320px; y1: 220px; x2: 450px; y2: 80px; stroke: #3b82f6; stroke-opacity: 0.8; stroke-width: 1; }
                    100% { x1: 450px; y1: 220px; x2: 450px; y2: 80px; stroke: #64748b; stroke-opacity: 0.5; }
                }

                @keyframes syncPacket {
                    0% { cx: 150px; opacity: 0; }
                    35% { cx: 150px; opacity: 0; }
                    40% { cx: 150px; opacity: 1; }
                    50% { cx: 450px; opacity: 1; }
                    55% { cx: 450px; opacity: 0; }
                    100% { cx: 450px; opacity: 0; }
                }
             `}
         </style>

         {/* AP Nodes */}
         {[150, 450].map((x, i) => (
             <g key={i} transform={`translate(${x}, 80)`}>
                 {/* Range Circle */}
                 <circle r="30" fill="none" stroke="#334155" strokeDasharray="2 2" strokeOpacity="0.3" />
                 {/* Device */}
                 <rect x="-15" y="-10" width="30" height="20" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                 {/* LED */}
                 <circle cx="10" cy="0" r="2" fill="#22c55e" />
                 <text y="30" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">AP-0{i+1}</text>
             </g>
         ))}

         {/* Edge Sync Path */}
         {mode === 'architect' && (
            <>
              <path d="M 180 80 L 420 80" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <text x="300" y="65" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">STATE SYNC (L2 MESH)</text>
              {/* Sync Packet (The Green Dot flying across) */}
              <circle r="4" fill="#22c55e" cy="80" className="animate-[syncPacket_4s_linear_infinite]" filter="url(#glow-green)" />
            </>
         )}

         {/* Connection Line */}
         <line className="animate-[lineFollow_4s_linear_infinite]" strokeWidth="1" />

         {/* Client Device */}
         <g className="animate-[clientPos_4s_linear_infinite]">
             <circle r="12" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
             <text y="24" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">USER</text>
         </g>
      </svg>
      
      {/* Legend / Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4">
          <div className="text-[10px] text-slate-500 font-mono">
              LATENCY: <span className="text-arista-green font-bold">0ms (Local)</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
              CONTROLLER: <span className="text-slate-600 line-through">BYPASSED</span>
          </div>
      </div>
    </div>
);

// --- MAIN HERO COMPONENT ---

export const Hero: React.FC = () => {
  const { copyToClipboard, mode } = useStore();

  return (
    <Section 
      id="hero" 
      eyebrow="NEXT GENERATION WIRELESS" 
      title="Architecture Defines Behavior" 
      subtitle={mode === 'executive' ? "Why your choice of wireless architecture directly impacts business continuity and operational cost." : "Compare the legacy controller model vs. Distributed Control Architecture"}
    >
      <div className="flex flex-col gap-24 relative max-w-5xl mx-auto">
        
        {/* BLOCK 1: LEGACY */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
             <div className="space-y-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arista-red/10 border border-arista-red/30 text-arista-red text-[10px] font-mono tracking-widest uppercase w-fit shadow-[0_0_15px_color-mix(in_srgb,#ef4444,transparent_90%)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-arista-red animate-pulse" />
                    Legacy Model
                 </div>
                 
                 <div className="group cursor-pointer" onClick={() => copyToClipboard("The Bottleneck Architecture")}>
                    <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                        The <span className="text-transparent bg-clip-text bg-linear-to-r from-arista-red to-arista-amber">Bottleneck</span><br/> Architecture
                    </h3>
                </div>

                 <p className="text-lg text-slate-300 leading-relaxed font-light">
                   Legacy architectures centralize control logic. This introduces shared control-plane dependencies, <Jargon term="RF" definition="Radio Frequency - the wireless signals that connect devices to the network." /> decision latency, and operational choke points.
                 </p>

                 {/* Impact Alert Box */}
                 <div className="relative overflow-hidden bg-arista-red/10 rounded-xl border border-arista-red/20 p-4 backdrop-blur-sm shadow-inner transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-arista-red/50" />
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-arista-red shrink-0 mt-0.5" size={16} />
                        <div>
                            <strong className="text-arista-red block text-xs font-mono uppercase tracking-wider mb-1">{mode === 'executive' ? 'Business Risk' : 'Operational Impact'}</strong>
                            <p className="text-sm text-slate-300">
                                {mode === 'executive' ? 'A controller failure can take down the entire wireless network, halting productivity. Upgrades require scheduled downtime.' : 'Artificial scale limits persist due to centralized architecture. Upgrades require downtime.'}
                            </p>
                        </div>
                    </div>
                 </div>
             </div>

             {/* INLINE VISUAL FOR LEGACY */}
             <BottleneckDiagram mode={mode} />
        </motion.div>


        {/* BLOCK 2: SYSTEM */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
             <div className="space-y-6 order-1 lg:order-0">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arista-blue/10 border border-arista-blue/30 text-arista-blue text-[10px] font-mono tracking-widest uppercase w-fit shadow-[0_0_15px_color-mix(in_srgb,#3b82f6,transparent_90%)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-arista-blue" />
                    System-Native Model
                 </div>

                 <div className="group cursor-pointer" onClick={() => copyToClipboard("Distributed Edge Intelligence")}>
                    <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                        Distributed <span className="text-transparent bg-clip-text bg-linear-to-r from-arista-blue to-arista-purple">Edge</span><br/> Intelligence
                    </h3>
                </div>

                 <p className="text-lg text-slate-300 leading-relaxed font-light">
                   System-native means distributed by design. APs execute <Jargon term="RF" definition="Radio Frequency - the wireless signals that connect devices to the network." /> decisions locally, share state horizontally, and operate as a coordinated mesh.
                 </p>

                 <div className="bg-arista-blue/10 border border-arista-blue/20 rounded-lg p-4">
                    <p className="text-sm text-slate-300">
                        <strong className="text-white block mb-1">{mode === 'executive' ? 'Resilience by Design' : 'CloudVision is NOT a Controller.'}</strong>
                        {mode === 'executive' ? 'If the connection to the management cloud is lost, the local network continues to operate autonomously. Forwarding is unaffected.' : 'It serves as the management plane but does not participate in packet forwarding, encryption, or millisecond-level RF control loops.'}
                    </p>
                 </div>

                 {/* Pillars Grid */}
                 <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { icon: Network, label: 'Edge Intelligence', sub: 'Distributed' },
                      { icon: ArrowRight, label: 'Data Plane', sub: 'Native L2/L3' },
                      { icon: ShieldCheck, label: 'State', sub: 'Continuous' }
                    ].map((pillar) => (
                      <div key={pillar.label} className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg bg-arista-card/40 border border-arista-border text-center shadow-lg backdrop-blur-sm transition-all hover:bg-arista-card/60 hover:border-arista-blue/30 group">
                        <div className="p-1.5 rounded-full bg-arista-bg group-hover:bg-arista-blue/10 transition-colors">
                            <pillar.icon size={16} className="text-arista-blue" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-slate-200 uppercase tracking-wider">{pillar.label}</span>
                        </div>
                      </div>
                    ))}
                 </div>
             </div>

             {/* INLINE VISUAL FOR SYSTEM (ROAMING) */}
             <div className="order-2 lg:order-0">
                <RoamingDiagram mode={mode} />
             </div>
        </motion.div>

      </div>
    </Section>
  );
};