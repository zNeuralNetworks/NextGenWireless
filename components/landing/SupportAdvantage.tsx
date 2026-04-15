import React from 'react';
import { Section } from '../ui/Section';
import { Code, Database, CheckCircle, Clock, Search, Network, XCircle, Shield, TrendingDown, Zap } from 'lucide-react';
import { AttributionTag } from '../ui/AttributionTag';
import { Jargon } from '../ui/Jargon';
import { useStore } from '../../store';

// --- VISUAL: Ticket Lifecycle Simulator ---
const TicketSim = () => {
  return (
    <div className="w-full bg-arista-bg/50 border border-arista-border rounded-xl p-6 relative overflow-hidden flex flex-col">
       {/* Header / Legend */}
      <div className="flex justify-between items-center mb-8 border-b border-arista-border/30 pb-4">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest hidden md:block">
            Resolution Path Architecture
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-arista-red" />
                <span className="text-[10px] text-slate-400 font-mono uppercase">Siloed Data Models</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-arista-green" />
                <span className="text-[10px] text-arista-green font-mono uppercase font-bold">Unified Schema</span>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative flex-1">
        
        {/* CENTER DIVIDER */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-arista-border hidden md:block" />

        {/* LEFT: LEGACY (Siloed) */}
        <div className="relative flex flex-col gap-6">
            {/* Timeline Line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-800" />
            
            {/* Step 1 */}
            <div className="relative pl-12">
                <div className="absolute left-2 top-0 w-4 h-4 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[9px] text-slate-300 font-mono z-10">1</div>
                <div className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <Search size={14} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-300">Wireless Dataset</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">Telemetry limited to RF domain.</p>
                </div>
            </div>

            {/* Step 2 */}
            <div className="relative pl-12">
                 <div className="absolute left-2 top-0 w-4 h-4 rounded-full bg-arista-red/20 border border-arista-red/50 flex items-center justify-center text-[9px] text-arista-red font-mono z-10">2</div>
                 <div className="p-3 bg-arista-red/5 border border-arista-red/20 rounded-lg relative">
                    <div className="flex items-center gap-2 mb-1">
                        <XCircle size={14} className="text-arista-red" />
                        <span className="text-xs font-bold text-arista-red">Correlation Gap</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                         Data mismatch between Wired/Wireless tools.
                    </div>
                    
                    {/* Badge */}
                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/2 z-20">
                         <div className="bg-arista-bg border border-arista-red/30 px-2 py-1 rounded text-[9px] text-arista-red font-mono whitespace-nowrap shadow-xl">
                            SILO BOUNDARY
                         </div>
                    </div>
                 </div>
            </div>

            {/* Step 3 */}
            <div className="relative pl-12">
                <div className="absolute left-2 top-0 w-4 h-4 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[9px] text-slate-300 font-mono z-10">3</div>
                <div className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <Search size={14} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-300">Wired Dataset</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">Telemetry limited to Port/VLAN domain.</p>
                </div>
            </div>

             {/* Time Indicator */}
             <div className="mt-auto pl-12 flex items-center gap-2 opacity-50 pt-4">
                 <Clock size={12} className="text-slate-500" />
                 <div className="h-1 flex-1 bg-linear-to-r from-slate-700 to-slate-800 rounded-full" />
                 <span className="text-[9px] text-slate-500 font-mono">High Latency (<Jargon term="MTTI" definition="Mean Time To Innocence - how long it takes to prove the network isn't the problem." />)</span>
             </div>
        </div>

        {/* RIGHT: ARISTA (System-Native) */}
        <div className="relative flex flex-col gap-6">
             {/* Timeline Line */}
            <div className="absolute left-4 top-2 bottom-12 w-0.5 bg-linear-to-b from-arista-green/20 to-arista-green" />

            {/* Step 1 */}
            <div className="relative pl-12">
                <div className="absolute left-2 top-0 w-4 h-4 rounded-full bg-arista-green/20 border border-arista-green/50 flex items-center justify-center text-[9px] text-arista-green font-mono z-10">1</div>
                <div className="p-3 bg-arista-card border border-arista-border rounded-lg opacity-80">
                    <div className="flex items-center gap-2 mb-1">
                        <Database size={14} className="text-arista-blue" />
                        <span className="text-xs font-bold text-slate-300">Unified Ingest</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">System-native data lake (Wired + Wireless).</p>
                </div>
            </div>

            {/* Step 2 (The Green Box) */}
            <div className="relative pl-12">
                 <div className="absolute left-2 top-0 w-4 h-4 rounded-full bg-arista-green border border-arista-green flex items-center justify-center text-[9px] text-black font-bold font-mono z-10">2</div>
                 <div className="p-4 bg-arista-green/10 border border-arista-green/30 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={14} className="text-arista-green" />
                        <span className="text-xs font-bold text-white">Algorithmic Correlation</span>
                    </div>
                    <p className="text-[10px] text-arista-green/80 font-mono leading-relaxed">
                        Events are inherently aligned by time and scope within the system. No manual bridging required.
                    </p>
                 </div>
            </div>

            {/* Step 3 */}
            <div className="relative pl-12">
                 <div className="absolute left-2 top-0 w-4 h-4 rounded-full bg-arista-green/20 border border-arista-green/50 flex items-center justify-center text-[9px] text-arista-green font-mono z-10">3</div>
                 <div className="flex items-center gap-3 pt-1">
                    <div className="text-xs font-bold text-white">Deterministic Root Cause</div>
                    <div className="h-px flex-1 bg-arista-green/30" />
                 </div>
            </div>

             {/* Time Indicator */}
             <div className="mt-auto pl-12 flex items-center gap-2 pt-4">
                 <Clock size={12} className="text-arista-green" />
                 <div className="h-1 w-12 bg-arista-green rounded-full" />
                 <span className="text-[9px] text-arista-green font-mono">Instant</span>
             </div>
        </div>

      </div>
      
      {/* Footer Caption */}
      <div className="mt-8 pt-4 border-t border-arista-border/30 text-center">
          <p className="text-xs text-slate-400 italic font-light">
              "When telemetry is unified, resolution paths collapse by design."
          </p>
      </div>
      
      <AttributionTag />
    </div>
  );
};

export const SupportAdvantage: React.FC = () => {
  const { mode } = useStore();

  const architectFeatures = [
    {
      icon: Database,
      color: 'text-arista-blue',
      bg: 'bg-arista-blue/10',
      border: 'border-arista-blue/20',
      title: 'Unified Telemetry Schema',
      desc: 'Wired and wireless telemetry stream into a common, system-native data lake. The system correlates events across domains without requiring human translation or tool-swapping.'
    },
    {
      icon: Clock,
      color: 'text-arista-purple',
      bg: 'bg-arista-purple/10',
      border: 'border-arista-purple/20',
      title: 'Time-Aligned Correlation',
      desc: 'The system natively aligns RF events, DHCP transactions, and wired port counters on a single timeline. Correlation is an architectural property, not a manual investigation step.'
    },
    {
      icon: Code,
      color: 'text-arista-emerald',
      bg: 'bg-arista-emerald/10',
      border: 'border-arista-emerald/20',
      title: 'Code-Level Access',
      desc: <><Jargon term="TAC" definition="Technical Assistance Center - the support engineers you call when things break." /> sits adjacent to Software Engineering. Bugs are identified, reproduced, and patched faster because support engineers have direct access to the codebase and development teams.<br/><br/><strong className="text-slate-200">No "Franken-stack" delays</strong>.</>
    }
  ];

  const executiveFeatures = [
    {
      icon: Shield,
      color: 'text-arista-blue',
      bg: 'bg-arista-blue/10',
      border: 'border-arista-blue/20',
      title: 'Risk Mitigation',
      desc: 'Faster resolution times mean less downtime for critical business applications. Arista\'s unified support model directly protects revenue and productivity.'
    },
    {
      icon: TrendingDown,
      color: 'text-arista-purple',
      bg: 'bg-arista-purple/10',
      border: 'border-arista-purple/20',
      title: 'Reduced Operational Cost',
      desc: 'By eliminating the "finger-pointing" between wired and wireless teams, Arista drastically reduces the man-hours spent on troubleshooting, lowering overall IT support costs.'
    },
    {
      icon: Zap,
      color: 'text-arista-emerald',
      bg: 'bg-arista-emerald/10',
      border: 'border-arista-emerald/20',
      title: 'Accelerated Time-to-Resolution',
      desc: <>Direct access to Tier-3 engineering means complex issues are resolved in hours, not weeks. <Jargon term="TAC" definition="Technical Assistance Center - the support engineers you call when things break." /> is empowered to fix the root cause, not just apply band-aids.</>
    }
  ];

  const features = mode === 'executive' ? executiveFeatures : architectFeatures;

  return (
    <Section id="support" title="Arista Support Advantage" subtitle="Faster resolution emerges from unified telemetry, not escalation velocity.">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-arista-card/40 border border-arista-border p-6 rounded-2xl hover:bg-arista-card/60 transition-colors group">
                <div className={`w-12 h-12 rounded-lg ${feature.bg} border ${feature.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={feature.color} size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.desc}
                </p>
            </div>
          ))}
      </div>

      <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
              <Network size={16} className="text-arista-blue" />
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">Resolution Path Comparison</h4>
          </div>
          <TicketSim />
      </div>

    </Section>
  );
};