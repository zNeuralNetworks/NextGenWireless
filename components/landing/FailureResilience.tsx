import React from 'react';
import { useStore } from '../../store';
import { Section } from '../ui/Section';
import AlertTriangle from 'lucide-react/dist/esm/icons/triangle-alert.js';
import CheckCircle from 'lucide-react/dist/esm/icons/circle-check-big.js';
import Wifi from 'lucide-react/dist/esm/icons/wifi.js';
import CloudOff from 'lucide-react/dist/esm/icons/cloud-off.js';
import Activity from 'lucide-react/dist/esm/icons/activity.js';
import Scissors from 'lucide-react/dist/esm/icons/scissors.js';
import Zap from 'lucide-react/dist/esm/icons/zap.js';
import Shield from 'lucide-react/dist/esm/icons/shield.js';
import Database from 'lucide-react/dist/esm/icons/database.js';
import Brain from 'lucide-react/dist/esm/icons/brain.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Jargon } from '../ui/Jargon';
import { GlassCard } from '../ui/GlassCard';
import { SandboxRelay } from '../ui/SandboxRelay';

export const FailureResilience: React.FC = () => {
  const { failureMode, setFailureMode, mode } = useStore();

  const scenarios: { id: 'none' | 'mgmt' | 'ap' | 'wan'; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'none', label: 'System Healthy', icon: CheckCircle, color: 'text-arista-green' },
    { id: 'mgmt', label: 'Mgmt / Cloud Down', icon: CloudOff, color: 'text-slate-400' },
    { id: 'ap', label: 'AP Hardware Failure', icon: Wifi, color: 'text-arista-red' },
  ];

  const toggleConnection = () => {
      setFailureMode(failureMode === 'mgmt' ? 'none' : 'mgmt');
  };

  return (
    <Section id="failure" title={mode === 'executive' ? "Business Continuity Guaranteed" : "Resilience by Design"} subtitle={mode === 'executive' ? "How Arista's architecture protects your operations from catastrophic outages." : "Intentional blast-radius engineering via distributed architecture."}>
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Tactical Controls */}
        <div className="lg:w-1/3">
          <GlassCard className="rounded-2xl sticky top-32 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
               <Activity size={16} className="text-arista-red" />
               <h3 className="text-sm font-bold text-white uppercase tracking-wider">{mode === 'executive' ? 'Disaster Simulation' : 'Chaos Engineering'}</h3>
            </div>
            
            <div className="space-y-3">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFailureMode(s.id as any)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                    failureMode === s.id 
                      ? 'bg-black/60 border-arista-red shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]' 
                      : 'bg-black/20 border-white/5 hover:bg-black/40 hover:border-white/20'
                  }`}
                >
                  <div className={`absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full transition-transform duration-700 ${failureMode === s.id ? 'animate-[shimmer_2s_infinite]' : ''}`} />
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <s.icon size={18} className={failureMode === s.id ? s.color : 'text-slate-600 group-hover:text-slate-400'} />
                    <span className={`text-sm font-medium ${failureMode === s.id ? 'text-white font-bold tracking-wide' : 'text-slate-400 group-hover:text-slate-300'}`}>{s.label}</span>
                  </div>
                  
                  {failureMode === s.id && (
                      <div className="w-2 h-2 rounded-full bg-arista-red animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-4 border-t border-white/10 overflow-hidden bg-black/80 rounded-lg shadow-inner">
               <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center gap-2">
                   <div className="flex gap-1.5 mr-2">
                        <div className="w-2 h-2 rounded-full bg-arista-red/30"></div>
                        <div className="w-2 h-2 rounded-full bg-arista-amber/30"></div>
                        <div className="w-2 h-2 rounded-full bg-arista-green/50"></div>
                   </div>
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">syslog_stream.txt</span>
               </div>
               <div className="p-4 h-48 overflow-y-auto no-scrollbar">
                   <AnimatePresence mode="popLayout">
                     <motion.div 
                        key={failureMode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2 text-[10px] font-mono"
                     >
                       <div className="text-slate-600 mb-2">[{new Date().toISOString().split('T')[1].slice(0,-2)}] STATE_CHANGE: {failureMode.toUpperCase()}</div>
                       
                       {failureMode === 'none' && (
                           <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="text-arista-green">
                               {'>'} ALL SYSTEMS NOMINAL<br/>
                               {'>'} HEARTBEAT [OK]<br/>
                               {'>'} VXLAN TUNNELS: ACTIVE
                           </motion.div>
                       )}
                       
                       {failureMode === 'mgmt' && (
                         <div className="space-y-1">
                           <motion.div initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} className="text-arista-red font-bold">
                               {'>'} WARN_CLOUD_ISOLATION: CVP UNREACHABLE
                           </motion.div>
                           <motion.div initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} transition={{delay:0.2}} className="text-arista-green opacity-90">
                               {'>'} DATA PLANE FORWARDING: CONTINUING
                           </motion.div>
                           <motion.div initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} transition={{delay:0.4}} className="text-arista-green opacity-90">
                               {'>'} LOCAL ASSOC/ROAM: NOMINAL
                           </motion.div>
                           <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}} className="text-arista-blue/80 mt-2 bg-arista-blue/5 p-1 rounded">
                               SYS_NOTE: 0% User Impact detected.
                           </motion.div>
                         </div>
                       )}
                       
                       {failureMode === 'ap' && (
                         <div className="space-y-1">
                           <motion.div initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} className="text-arista-red font-bold">
                               {'>'} ERR_NODE_FAILURE: AP-01 OFFLINE
                           </motion.div>
                           <motion.div initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} transition={{delay:0.2}} className="text-arista-amber">
                               {'>'} COVERAGE GAP DETECTED IN SECTOR 7G
                           </motion.div>
                           <motion.div initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} transition={{delay:0.4}} className="text-arista-green opacity-90">
                               {'>'} AUTO-POWER ADJUSTMENT INITIATED
                           </motion.div>
                           <motion.div initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} transition={{delay:0.6}} className="text-arista-green opacity-90">
                               {'>'} CLIENT STEERING: 100% SUCCESS
                           </motion.div>
                         </div>
                       )}
                     </motion.div>
                   </AnimatePresence>
               </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <SandboxRelay config={{ sandboxArchitecture: 'edge', sandboxFailure: 'cloud' }} variant="purple">
                  [Simulate in Sandbox]
              </SandboxRelay>
            </div>
          </GlassCard>
        </div>

        {/* Schematic Visual */}
        <div className="lg:w-2/3 min-h-[400px] bg-arista-bg rounded-2xl border border-arista-border relative overflow-hidden flex items-center justify-center p-8 shadow-2xl group">
           {/* Ambient Glow */}
           <div className={`absolute inset-0 transition-colors duration-1000 ${failureMode === 'mgmt' ? 'bg-arista-green/5' : 'bg-arista-blue/5'}`} />
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0f1117_100%)]" />
           
           <svg viewBox="0 0 500 350" className="w-full h-full relative z-10">
              <defs>
                  <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.1"/>
                  </pattern>
                  <filter id="glow-glass">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <linearGradient id="stream-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#a855f7" stopOpacity="0"/>
                      <stop offset="0.5" stopColor="#a855f7" stopOpacity="1"/>
                      <stop offset="1" stopColor="#a855f7" stopOpacity="0"/>
                  </linearGradient>
              </defs>

              {/* 1. CLOUD ENGINE (CloudVision) */}
              <motion.g 
                animate={{ 
                    opacity: failureMode === 'mgmt' ? 0.3 : 1, 
                    filter: failureMode === 'mgmt' ? 'grayscale(100%) brightness(0.5)' : 'none' 
                }}
                transition={{ duration: 0.5 }}
              >
                 {/* Glass Container */}
                 <rect x="120" y="30" width="260" height="90" rx="16" fill="#1e293b" fillOpacity="0.4" stroke="#334155" strokeWidth="1" />
                 {/* Internal Grid */}
                 <rect x="120" y="30" width="260" height="90" rx="16" fill="url(#grid-pattern)" />
                 
                 {/* Brain of the Cloud */}
                 <foreignObject x="235" y="45" width="30" height="30">
                    <div className="flex items-center justify-center w-full h-full">
                         <Brain size={24} className="text-arista-purple opacity-80" />
                    </div>
                 </foreignObject>

                 {/* Activity Pulses */}
                 {failureMode !== 'mgmt' && (
                     <>
                        <circle cx="150" cy="50" r="2" fill="#3b82f6"><animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/></circle>
                        <circle cx="160" cy="50" r="2" fill="#3b82f6"><animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin="0.5s" repeatCount="indefinite"/></circle>
                        <circle cx="340" cy="90" r="2" fill="#a855f7"><animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite"/></circle>
                     </>
                 )}

                 {/* Label */}
                 <g transform="translate(250, 95)">
                    <text textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" letterSpacing="1">CLOUDVISION</text>
                    <text y="14" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" letterSpacing="2">MGMT PLANE</text>
                 </g>
              </motion.g>

              {/* 2. CONTROL LINKS (Streaming) */}
              {[120, 250, 380].map((x, i) => (
                  <g key={i}>
                      {/* Connection Line */}
                      <motion.line 
                        x1={x} y1="220" x2="250" y2="120" 
                        stroke={failureMode === 'mgmt' ? '#ef4444' : '#334155'} 
                        strokeWidth="1" 
                        strokeDasharray="4 4"
                        animate={{ opacity: failureMode === 'mgmt' ? 0.2 : 0.6 }}
                      />
                      
                      {/* Streaming Particles */}
                      {failureMode !== 'mgmt' && failureMode !== 'ap' && (
                          <>
                            {/* Upstream: Telemetry (Purple, Fast) */}
                            <circle r="1.5" fill="#a855f7">
                                <animateMotion 
                                   dur={`${1.5 + i * 0.3}s`} 
                                   repeatCount="indefinite" 
                                   path={`M ${x} 220 L 250 120`} 
                                   keyPoints="0;1"
                                   keyTimes="0;1"
                                   calcMode="linear"
                                />
                            </circle>
                            {/* Downstream: Config (Blue, Rare) */}
                            <circle r="1.5" fill="#3b82f6" opacity="0.7">
                                <animateMotion 
                                   dur={`${4 + i}s`} 
                                   repeatCount="indefinite" 
                                   path={`M 250 120 L ${x} 220`} 
                                   keyPoints="0;1"
                                   keyTimes="0;1"
                                   calcMode="linear"
                                />
                            </circle>
                          </>
                      )}
                  </g>
              ))}

              {/* 3. INTERACTIVE CUT POINT */}
              {/* Wrapped in static group to prevent Framer Motion from overwriting translation with scale */}
              <g transform="translate(250, 170)">
                <motion.g 
                  onTap={toggleConnection}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ cursor: 'pointer' }}
                >
                    {/* Invisible Hit Area */}
                    <circle r="24" fill="transparent" />
                    
                    {/* Visuals */}
                    <circle r="14" fill="#0f172a" stroke={failureMode === 'mgmt' ? '#ef4444' : '#334155'} strokeWidth="1" />
                    
                    {/* Centered Icons */}
                    <g transform="translate(-7, -7)">
                        {failureMode === 'mgmt' ? (
                            <Zap size={14} className="text-arista-green animate-pulse pointer-events-none" />
                        ) : (
                            <Scissors size={14} className="text-slate-400 hover:text-arista-red transition-colors pointer-events-none" />
                        )}
                    </g>
                </motion.g>
              </g>

              {/* 4. SWARM LAYER (Horizontal Links) */}
              <path 
                d="M 120 220 L 380 220" 
                stroke="#3b82f6" 
                strokeWidth="1" 
                strokeDasharray="2 4" 
                opacity="0.2"
              />
              {/* Peer Traffic Animation */}
              {failureMode !== 'ap' && (
                  <circle r="2" fill="#3b82f6" opacity="0.5">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M 120 220 L 380 220 L 120 220" />
                  </circle>
              )}


              {/* 5. AP LAYER */}
              <g>
                  {/* AP 1 (Failing) */}
                  <motion.g animate={{ opacity: failureMode === 'ap' ? 0.3 : 1 }}>
                     <circle cx="120" cy="220" r="24" fill="#0f172a" stroke={failureMode === 'ap' ? '#ef4444' : (failureMode === 'mgmt' ? '#10b981' : '#3b82f6')} strokeWidth="2" />
                     
                     {/* Mini Brain Icon */}
                     <foreignObject x="113" y="213" width="14" height="14">
                        <Brain size={14} className={failureMode === 'mgmt' ? 'text-arista-green animate-pulse' : 'text-arista-blue'} />
                     </foreignObject>
 
                     {failureMode === 'ap' && (
                         <AlertTriangle size={16} x="112" y="212" className="text-arista-red" />
                     )}
                     <text x="120" y="260" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">AP-01</text>
                  </motion.g>
                  
                  {/* Neighbor APs */}
                  {[250, 380].map((x, i) => (
                      <motion.g key={x}>
                        <circle cx={x} cy="220" r="24" fill="#0f172a" stroke={failureMode === 'mgmt' ? '#10b981' : '#3b82f6'} strokeWidth="2" />
                        
                        {/* Mini Brain Icon */}
                        <foreignObject x={x-7} y="213" width="14" height="14">
                            <Brain size={14} className={failureMode === 'mgmt' ? 'text-arista-green animate-pulse' : 'text-arista-blue'} />
                        </foreignObject>
 
                        {/* Healing pulse if AP1 fails */}
                        {failureMode === 'ap' && (
                            <motion.circle 
                                cx={x} cy="220" r="20" 
                                stroke="#f59e0b" strokeWidth="2" fill="none"
                                initial={{ scale: 1, opacity: 0.8 }}
                                animate={{ scale: 1.4, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}
 
                        {/* Success Badge if Mgmt Fails (Proving Survival) */}
                        {failureMode === 'mgmt' && (
                            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} className="origin-center">
                                <circle cx={x+18} cy="202" r="8" fill="#10b981" />
                                <CheckCircle size={10} x={x+13} y={197} className="text-black" />
                            </motion.g>
                        )}
                        
                        <text x={x} y="260" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">AP-0{i+2}</text>
                      </motion.g>
                  ))}
              </g>

              {/* 6. DATA PLANE FOUNDATION */}
              <g transform="translate(0, 300)">
                  <rect x="50" y="0" width="400" height="6" rx="3" fill="#1e293b" />
                  <motion.rect 
                    x="50" y="0" width="100" height="6" rx="3" 
                    fill={failureMode === 'mgmt' ? '#10b981' : '#3b82f6'}
                    animate={{ x: [50, 350, 50] }}
                    transition={{ duration: failureMode === 'mgmt' ? 1.5 : 3, repeat: Infinity, ease: "linear" }}
                  />
                  <text x="250" y="25" textAnchor="middle" fill={failureMode === 'mgmt' ? '#10b981' : '#475569'} fontSize="10" letterSpacing="2" fontFamily="monospace" fontWeight="bold">
                      DATA PLANE ({failureMode === 'mgmt' ? 'AUTONOMOUS' : 'INDEPENDENT'})
                  </text>
              </g>

           </svg>
           
           {/* Instructional Tooltip */}
           {failureMode === 'none' && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 bg-arista-bg/90 border border-arista-border px-3 py-1 rounded-full text-[10px] text-slate-400 pointer-events-none"
                >
                    Try cutting the connection ✂️
                </motion.div>
           )}
        </div>
      </div>
    </Section>
  );
};