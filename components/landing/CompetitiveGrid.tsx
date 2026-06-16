import React from 'react';
import { Section } from '../ui/Section';
import Server from 'lucide-react/dist/esm/icons/server.js';
import Cloud from 'lucide-react/dist/esm/icons/cloud.js';
import Cpu from 'lucide-react/dist/esm/icons/cpu.js';
import XCircle from 'lucide-react/dist/esm/icons/circle-x.js';
import AlertTriangle from 'lucide-react/dist/esm/icons/triangle-alert.js';
import CheckCircle from 'lucide-react/dist/esm/icons/circle-check-big.js';
import { AttributionTag } from '../ui/AttributionTag';
import { Jargon } from '../ui/Jargon';
import { useStore } from '../../store';
import { GlassCard } from '../ui/GlassCard';

export const CompetitiveGrid: React.FC = () => {
  const { mode } = useStore();

  return (
    <Section id="comparison" title={mode === 'executive' ? "The Business Lens" : "The Architectural Lens"} subtitle={mode === 'executive' ? "How architectural choices impact your bottom line and risk profile." : "How control-plane placement dictates operational reality."}>
      <div className="relative group">
        <div className="lg:hidden absolute -top-8 right-0 flex items-center gap-1 text-[10px] font-mono text-slate-500 uppercase animate-pulse">
          <span>Scroll</span>
          <div className="w-4 h-px bg-slate-700" />
        </div>
        <div className="overflow-x-auto pb-8 scrollbar-hide touch-pan-x mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] sm:mask-none">
          <GlassCard padding="" className="min-w-[900px] grid grid-cols-4 gap-0 rounded-2xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform hover:scale-[1.005] duration-700 ease-out">
            
            {/* Headers */}
            <div className="sticky left-0 z-20 glass-card p-6 border-b border-r border-white/5 flex items-center shadow-[4px_0_15px_rgba(0,0,0,0.2)]">
                <span className="font-bold uppercase tracking-wider text-sm text-slate-300 font-heading">Feature</span>
            </div>

            <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col gap-2 hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-center gap-2 text-arista-red">
                    <Server size={18} />
                    <span className="font-bold uppercase tracking-wider text-sm font-heading">Controller-Centric</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Legacy (Cisco/Catalyst)</span>
            </div>

            <div className="p-6 border-b border-l border-white/5 bg-white/5 flex flex-col gap-2 hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-center gap-2 text-arista-amber">
                    <Cloud size={18} />
                    <span className="font-bold uppercase tracking-wider text-sm font-heading">Cloud-Controller</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Meraki / Aruba Central</span>
            </div>

            <div className="p-6 border-b border-l border-white/5 bg-arista-blue/10 flex flex-col gap-2 relative hover:bg-arista-blue/20 transition-colors duration-300">
                <div className="absolute top-0 right-0 bg-arista-blue text-white text-[9px] font-bold px-2 py-0.5 rounded-bl shadow-[0_0_10px_color-mix(in_srgb,var(--color-arista-blue),transparent_50%)]">SYSTEM-NATIVE</div>
                <div className="flex items-center gap-2 text-arista-blue">
                    <Cpu size={18} />
                    <span className="font-bold uppercase tracking-wider text-sm font-heading">Distributed Edge</span>
                </div>
                <span className="text-xs text-arista-blue/70 font-mono">Arista Networks</span>
            </div>

            {/* ROW 1: Control Plane */}
            <div className="sticky left-0 z-20 glass-card p-6 border-b border-r border-white/5 flex items-center shadow-[4px_0_15px_rgba(0,0,0,0.2)]">
                <span className="font-bold text-white font-heading">{mode === 'executive' ? 'Architecture Cost' : 'Control Plane'}</span>
            </div>
            <div className="p-6 border-b border-white/5 text-sm text-slate-400 hover:bg-white/5 transition-colors duration-300">
                <strong className="block text-slate-200 mb-1">{mode === 'executive' ? 'High Hardware CapEx' : 'Physical Appliance'}</strong>
                {mode === 'executive' ? 'Requires expensive, redundant hardware controllers.' : 'Control logic lives in a central box. APs are "dumb antennas".'}
            </div>
            <div className="p-6 border-b border-l border-white/5 text-sm text-slate-400 hover:bg-white/5 transition-colors duration-300">
                <strong className="block text-slate-200 mb-1">{mode === 'executive' ? 'Subscription Lock-in' : 'Public Cloud'}</strong>
                {mode === 'executive' ? 'Ongoing licensing fees for cloud-hosted control.' : 'Control logic lives in the vendor\'s cloud. APs depend on WAN.'}
            </div>
            <div className="p-6 border-b border-l border-white/5 bg-arista-blue/5 text-sm text-slate-300 hover:bg-arista-blue/10 transition-colors duration-300 relative group/cell">
                <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-arista-blue/50 to-transparent opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                <strong className="block text-white mb-1">{mode === 'executive' ? 'Optimized TCO' : 'The Access Point'}</strong>
                {mode === 'executive' ? 'Intelligence is built into the APs you already buy.' : 'Control logic lives on the AP. Distributed intelligence.'}
            </div>

            {/* ROW 2: Mgmt/Cloud Failure */}
            <div className="sticky left-0 z-20 glass-card p-6 border-b border-r border-white/5 flex items-center shadow-[4px_0_15px_rgba(0,0,0,0.2)]">
                <span className="font-bold text-white font-heading">{mode === 'executive' ? 'Outage Risk' : 'Cloud/Mgmt Failure'}</span>
            </div>
            <div className="p-6 border-b border-white/5 text-sm text-slate-400 hover:bg-white/5 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-1 text-arista-red">
                    <XCircle size={14} /> <span className="font-bold">Critical Risk</span>
                </div>
                {mode === 'executive' ? 'Single point of failure can take down the entire network.' : <>If controller fails, APs reboot or drop clients (unless <Jargon term="HA" definition="High Availability - buying two of everything so when one breaks, the other takes over." /> is purchased).</>}
            </div>
            <div className="p-6 border-b border-l border-white/5 text-sm text-slate-400 hover:bg-white/5 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-1 text-arista-amber">
                    <AlertTriangle size={14} /> <span className="font-bold">Stale State</span>
                </div>
                {mode === 'executive' ? 'Loss of visibility and control during cloud outages.' : 'Network stays up, but no config changes, no troubleshooting, delayed roaming.'}
            </div>
            <div className="p-6 border-b border-l border-white/5 bg-arista-blue/5 text-sm text-slate-300 hover:bg-arista-blue/10 transition-colors duration-300 relative group/cell">
                <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-arista-blue/50 to-transparent opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                <div className="flex items-center gap-2 mb-1 text-arista-green">
                    <CheckCircle size={14} /> <span className="font-bold">Autonomous</span>
                </div>
                {mode === 'executive' ? 'Continuous operation during WAN/cloud disconnects.' : <>Zero impact to data, policy, or <Jargon term="RF" definition="Radio Frequency - the invisible waves that make Wi-Fi work." />. Local control plane continues 100%.</>}
            </div>

            {/* ROW 3: Roaming & RF */}
            <div className="sticky left-0 z-20 glass-card p-6 border-r border-white/5 flex items-center shadow-[4px_0_15px_rgba(0,0,0,0.2)]">
                <span className="font-bold text-white font-heading">{mode === 'executive' ? 'User Experience' : 'Roaming & RF'}</span>
            </div>
            <div className="p-6 border-white/5 text-sm text-slate-400 hover:bg-white/5 transition-colors duration-300">
                <strong className="block text-slate-200 mb-1">{mode === 'executive' ? 'Inconsistent' : 'Central Decision'}</strong>
                {mode === 'executive' ? 'Latency can cause dropped calls and poor application performance.' : 'Latency-sensitive decisions must round-trip to the controller.'}
            </div>
            <div className="p-6 border-l border-white/5 text-sm text-slate-400 hover:bg-white/5 transition-colors duration-300">
                <strong className="block text-slate-200 mb-1">{mode === 'executive' ? 'Unpredictable' : 'Opaque Heuristics'}</strong>
                {mode === 'executive' ? 'Hard to prove ROI when issues are difficult to diagnose.' : '"AI" magic fixes things eventually. Hard to troubleshoot why.'}
            </div>
            <div className="p-6 border-l border-white/5 bg-arista-blue/5 text-sm text-slate-300 hover:bg-arista-blue/10 transition-colors duration-300 relative group/cell">
                <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-arista-blue/50 to-transparent opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                <strong className="block text-white mb-1">{mode === 'executive' ? 'Sub-Millisecond' : 'Edge Decision'}</strong>
                {mode === 'executive' ? 'Edge-native roaming decisions prevent voice and video latency spikes.' : 'Sub-millisecond decisions made locally. Explainable RF telemetry.'}
            </div>
          </GlassCard>
        </div>
        <div className="mt-4">
           <AttributionTag />
        </div>
      </div>
    </Section>
  );
};