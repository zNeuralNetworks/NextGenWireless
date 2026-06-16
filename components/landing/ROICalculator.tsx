import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { Section } from '../ui/Section';
import Zap from 'lucide-react/dist/esm/icons/zap.js';
import Users from 'lucide-react/dist/esm/icons/users.js';
import Settings2 from 'lucide-react/dist/esm/icons/settings-2.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.js';
import ShieldAlert from 'lucide-react/dist/esm/icons/shield-alert.js';
import FileText from 'lucide-react/dist/esm/icons/file-text.js';
import Info from 'lucide-react/dist/esm/icons/info.js';
import { AttributionTag } from '../ui/AttributionTag';
import { ROI_CONSTANTS } from '../../constants';
import { Jargon } from '../ui/Jargon';

type ArchitectureModel = 'controller' | 'cloud' | 'distributed';
type IncidentVolume = 'low' | 'medium' | 'high';

export const ROICalculator: React.FC = () => {
  // Global Scale Inputs
  const { roiAPs, setRoiAPs, roiSites, setRoiSites, mode } = useStore();

  // Local State
  const [model, setModel] = useState<ArchitectureModel>('controller');
  const [incidentVol, setIncidentVol] = useState<IncidentVolume>('medium');
  const [showDrawer, setShowDrawer] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const years = 3;

  // Derived Values
  const ticketsPerWeek = incidentVol === 'low' ? 5 : (incidentVol === 'medium' ? 20 : 50);

  // --- LOGIC ENGINE ---

  // 1. HARDWARE (Controllers Only - APs cancel out)
  const calculateHardware = (isDistributed: boolean) => {
    if (isDistributed) return 0; // No controllers
    if (model === 'cloud') return 0; // No controllers

    // Controller-Centric Logic
    const pairsByAP = Math.ceil(roiAPs / ROI_CONSTANTS.APS_PER_CONTROLLER_PAIR);
    const pairsBySite = roiSites; // Assume HA pair per site for enterprise resilience
    const totalControllers = Math.max(pairsByAP, pairsBySite) * 2;
    
    return totalControllers * ROI_CONSTANTS.CONTROLLER_UNIT_COST;
  };

  // 2. SUBSCRIPTION & SUPPORT
  const calculateSoftware = (isDistributed: boolean) => {
    if (isDistributed) {
        return roiAPs * ROI_CONSTANTS.SUB_DISTRIBUTED * years;
    } else {
        const subCost = model === 'cloud' ? ROI_CONSTANTS.SUB_CLOUD : ROI_CONSTANTS.SUB_LEGACY;
        let total = roiAPs * subCost * years;
        
        // Add Controller Support if Legacy
        if (model === 'controller') {
             const pairsByAP = Math.ceil(roiAPs / ROI_CONSTANTS.APS_PER_CONTROLLER_PAIR);
             const pairsBySite = roiSites;
             const totalControllers = Math.max(pairsByAP, pairsBySite) * 2;
             total += (totalControllers * ROI_CONSTANTS.CONTROLLER_ANNUAL_SUPPORT * years);
        }
        return total;
    }
  };

  // 3. DEPLOYMENT (Staging Overhead)
  const calculateInstall = (isDistributed: boolean) => {
    const costPerSite = isDistributed ? ROI_CONSTANTS.STAGING_COST_DISTRIBUTED : ROI_CONSTANTS.STAGING_COST_LEGACY;
    return roiSites * costPerSite;
  };

  // 4. OPEX (Tickets)
  const calculateOps = (isDistributed: boolean) => {
    const weeks = 52;
    const hours = isDistributed ? ROI_CONSTANTS.TICKET_HOURS_DISTRIBUTED : ROI_CONSTANTS.TICKET_HOURS_LEGACY;
    return ticketsPerWeek * weeks * hours * ROI_CONSTANTS.HOURLY_RATE * years;
  };

  // TOTALS
  const legacyHW = calculateHardware(false);
  const legacySW = calculateSoftware(false);
  const legacyInstall = calculateInstall(false);
  const legacyOps = calculateOps(false);
  const legacyTotal = legacyHW + legacySW + legacyInstall + legacyOps;

  const aristaHW = calculateHardware(true);
  const aristaSW = calculateSoftware(true);
  const aristaInstall = calculateInstall(true);
  const aristaOps = calculateOps(true);
  const aristaTotal = aristaHW + aristaSW + aristaInstall + aristaOps;

  const savings = legacyTotal - aristaTotal;
  const savingsPercent = Math.round((savings / legacyTotal) * 100);
  const maxTCO = Math.max(legacyTotal, aristaTotal);

  // Helper for formatting currency
  const fmt = (n: number) => `$${(n/1000).toFixed(0)}k`;

  // Architect Metrics
  const legacyHoursPerYear = ticketsPerWeek * 52 * ROI_CONSTANTS.TICKET_HOURS_LEGACY;
  const aristaHoursPerYear = ticketsPerWeek * 52 * ROI_CONSTANTS.TICKET_HOURS_DISTRIBUTED;
  const hoursSavedPerYear = legacyHoursPerYear - aristaHoursPerYear;
  const mttrReduction = Math.round(((ROI_CONSTANTS.TICKET_HOURS_LEGACY - ROI_CONSTANTS.TICKET_HOURS_DISTRIBUTED) / ROI_CONSTANTS.TICKET_HOURS_LEGACY) * 100);

  return (
    <Section id="roi" title="The Cost of Complexity" subtitle="Calculate the structural efficiency of Distributed vs Legacy models.">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 relative z-10">
          <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Baseline Architecture</label>
              <div className="relative group">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 group-hover:text-white"><ChevronDown size={14}/></div>
                  <select 
                    value={model} 
                    onChange={(e) => setModel(e.target.value as ArchitectureModel)}
                    className="appearance-none bg-arista-card border border-arista-border rounded-lg px-4 py-2 pr-10 text-sm font-bold text-white focus:outline-none focus:border-arista-blue hover:border-slate-500 transition-colors w-64"
                  >
                      <option value="controller">Controller-Centric Model</option>
                      <option value="cloud">Cloud-Controller Model</option>
                  </select>
              </div>
          </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* INPUTS PANEL */}
        <div className="w-full xl:w-1/3 space-y-6">
            <div className="bg-arista-card/50 backdrop-blur-sm border border-arista-border rounded-2xl p-6 relative">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2">
                         <Users size={16} className="text-arista-blue" /> Scale & Complexity
                     </h3>
                     <button 
                        onClick={() => setShowDrawer(true)}
                        className="flex items-center gap-1.5 text-[10px] font-mono text-arista-blue hover:text-white transition-colors uppercase tracking-wider border border-arista-blue/20 hover:bg-arista-blue/10 px-2 py-1 rounded"
                     >
                         <Settings2 size={12} /> Methodology
                     </button>
                 </div>

                 <div className="space-y-8">
                    <SliderInput label="Total AP Count" value={roiAPs} min={50} max={5000} step={50} onChange={setRoiAPs} unit="APs" />
                    <SliderInput label="Number of Sites" value={roiSites} min={1} max={200} step={1} onChange={setRoiSites} unit="Sites" />
                    
                    <div className="space-y-3">
                         <div className="flex justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
                            <span>Incident Volume</span>
                            <span className="text-white font-bold">{ticketsPerWeek} Tix/Wk</span>
                         </div>
                         <div className="grid grid-cols-3 gap-2">
                            {(['low', 'medium', 'high'] as IncidentVolume[]).map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setIncidentVol(v)}
                                    className={`py-2 rounded-md text-xs font-medium transition-all uppercase tracking-wider border ${
                                        incidentVol === v 
                                            ? 'bg-arista-blue border-arista-blue text-white shadow-lg' 
                                            : 'bg-arista-bg border-arista-border text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {v}
                                </button>
                            ))}
                         </div>
                    </div>
                 </div>
            </div>

            {/* Savings Big Number */}
            <div className={`bg-linear-to-br border rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden min-h-[180px] md:min-h-[200px] ${savings >= 0 ? 'from-arista-card to-arista-green/10 border-arista-green/30' : 'from-arista-card to-arista-red/10 border-arista-red/30'}`}>
                <div className="relative z-10">
                    {mode === 'executive' ? (
                        <>
                            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">3-Year TCO {savings >= 0 ? 'Advantage' : 'Increase'}</div>
                            <motion.div 
                                key={`savings-${savings}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-4xl md:text-5xl font-black tracking-tighter ${savings >= 0 ? 'text-white' : 'text-arista-red'}`}
                            >
                                ${Math.abs(savings).toLocaleString()}
                            </motion.div>
                            {savings > 0 && (
                                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-arista-green/20 text-arista-green text-xs font-bold">
                                    {savingsPercent}% Lower TCO
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Operational Time Saved</div>
                            <motion.div 
                                key={`hours-${hoursSavedPerYear}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl md:text-5xl font-black tracking-tighter text-white"
                            >
                                {hoursSavedPerYear.toLocaleString()} <span className="text-2xl text-slate-400">hrs/yr</span>
                            </motion.div>
                            <div className="mt-2 inline-block px-3 py-1 rounded-full bg-arista-green/20 text-arista-green text-xs font-bold">
                                {mttrReduction}% Faster MTTR
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            <div className="text-center">
                 <p className="text-[10px] text-slate-600 font-mono">
                    Dollar values are illustrative and do not represent vendor list pricing.
                 </p>
            </div>
        </div>

        {/* VISUALIZATION PANEL */}
        <div className="w-full xl:w-2/3 bg-arista-bg border border-arista-border rounded-2xl p-6 md:p-8 relative flex flex-col">
             
             {/* Chart Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                 <div>
                     <h4 className="font-bold text-white flex items-center gap-2">
                        <Zap size={16} className="text-arista-amber" /> Cost Drivers
                     </h4>
                     <p className="text-xs text-slate-500 mt-1">Comparison based on {years}-year horizon.</p>
                 </div>
                 
                 {/* Legend */}
                 <div className="flex flex-wrap gap-3 md:gap-4 text-[9px] md:text-[10px] font-mono text-slate-400 uppercase">
                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-arista-red" /> HW</div>
                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-arista-blue" /> Sub</div>
                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-arista-amber" /> Deploy</div>
                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-500" /> Ops</div>
                 </div>
             </div>

             {/* The Chart - Desktop (Vertical) */}
             <div className="hidden md:flex h-[300px] w-full items-end justify-center gap-16 pb-4 mt-12">
                 
                 {/* Left Pillar (Legacy) */}
                 <div className="w-32 flex flex-col justify-end h-full relative group">
                     <div className="absolute -top-10 w-full text-center">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                            {model === 'controller' ? 'Legacy' : 'Cloud Ctrl'}
                         </span>
                         <span className="text-[10px] font-mono text-slate-500">{fmt(legacyTotal)}</span>
                     </div>
                     
                     <BarSegment height={(legacyOps / maxTCO) * 100} color="bg-slate-500" label={fmt(legacyOps)} delay={0.3} tooltip="Ops Labor" />
                     <BarSegment height={(legacyInstall / maxTCO) * 100} color="bg-arista-amber" label={fmt(legacyInstall)} delay={0.2} tooltip="Staging Overhead" />
                     <BarSegment height={(legacySW / maxTCO) * 100} color="bg-arista-blue" label={fmt(legacySW)} delay={0.1} tooltip="Subs/Support" />
                     <BarSegment height={(legacyHW / maxTCO) * 100} color="bg-arista-red" label={fmt(legacyHW)} delay={0} tooltip="Hardware" />
                 </div>

                 {/* Right Pillar (Arista) */}
                 <div className="w-32 flex flex-col justify-end h-full relative group">
                     <div className="absolute -top-10 w-full text-center">
                         <span className="text-xs font-bold text-white uppercase tracking-wider block mb-0.5">Distributed</span>
                         <span className="text-[10px] font-mono text-arista-green font-bold">{fmt(aristaTotal)}</span>
                     </div>

                     <BarSegment height={(aristaOps / maxTCO) * 100} color="bg-slate-500/80" label={fmt(aristaOps)} delay={0.3} tooltip="Ops Labor (Efficient)" />
                     <BarSegment height={(aristaInstall / maxTCO) * 100} color="bg-arista-amber/80" label={fmt(aristaInstall)} delay={0.2} tooltip="Staging Overhead" />
                     <BarSegment height={(aristaSW / maxTCO) * 100} color="bg-arista-blue" label={fmt(aristaSW)} delay={0.1} tooltip="Subscription" />
                     <BarSegment height={(aristaHW / maxTCO) * 100} color="bg-arista-red" label={fmt(aristaHW)} delay={0} tooltip="Hardware" />
                 </div>
             </div>

             {/* The Chart - Mobile (Horizontal) */}
             <div className="flex md:hidden flex-col w-full justify-center gap-8 mt-4">
                 
                 {/* Top Bar (Legacy) */}
                 <div className="w-full flex flex-col relative group">
                     <div className="flex justify-between items-end mb-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {model === 'controller' ? 'Legacy' : 'Cloud Ctrl'}
                         </span>
                         <span className="text-[10px] font-mono text-slate-500">{fmt(legacyTotal)}</span>
                     </div>
                     
                     <div className="h-12 w-full flex bg-arista-card/30 rounded overflow-hidden">
                         <HorizontalBarSegment width={(legacyHW / maxTCO) * 100} color="bg-arista-red" label={fmt(legacyHW)} delay={0} tooltip="Hardware" />
                         <HorizontalBarSegment width={(legacySW / maxTCO) * 100} color="bg-arista-blue" label={fmt(legacySW)} delay={0.1} tooltip="Subs/Support" />
                         <HorizontalBarSegment width={(legacyInstall / maxTCO) * 100} color="bg-arista-amber" label={fmt(legacyInstall)} delay={0.2} tooltip="Staging Overhead" />
                         <HorizontalBarSegment width={(legacyOps / maxTCO) * 100} color="bg-slate-500" label={fmt(legacyOps)} delay={0.3} tooltip="Ops Labor" />
                     </div>
                 </div>

                 {/* Bottom Bar (Arista) */}
                 <div className="w-full flex flex-col relative group">
                     <div className="flex justify-between items-end mb-2">
                         <span className="text-[10px] font-bold text-white uppercase tracking-wider">Distributed</span>
                         <span className="text-[10px] font-mono text-arista-green font-bold">{fmt(aristaTotal)}</span>
                     </div>

                     <div className="h-12 w-full flex bg-arista-card/30 rounded overflow-hidden">
                         <HorizontalBarSegment width={(aristaHW / maxTCO) * 100} color="bg-arista-red" label={fmt(aristaHW)} delay={0} tooltip="Hardware" />
                         <HorizontalBarSegment width={(aristaSW / maxTCO) * 100} color="bg-arista-blue" label={fmt(aristaSW)} delay={0.1} tooltip="Subscription" />
                         <HorizontalBarSegment width={(aristaInstall / maxTCO) * 100} color="bg-arista-amber/80" label={fmt(aristaInstall)} delay={0.2} tooltip="Staging Overhead" />
                         <HorizontalBarSegment width={(aristaOps / maxTCO) * 100} color="bg-slate-500/80" label={fmt(aristaOps)} delay={0.3} tooltip="Ops Labor (Efficient)" />
                     </div>
                 </div>
             </div>
             
             <AttributionTag />
        </div>
      </div>

      {/* METHODOLOGY DRAWER */}
      <AnimatePresence>
        {showDrawer && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setShowDrawer(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                />
                <motion.div 
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-arista-card border-l border-arista-border z-50 overflow-y-auto shadow-2xl"
                >
                    <div className="p-6 border-b border-arista-border flex justify-between items-center sticky top-0 bg-arista-card/95 backdrop-blur z-10">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileText size={18} className="text-arista-blue" /> Methodology
                        </h3>
                        <button onClick={() => setShowDrawer(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                    </div>

                    <div className="p-6 space-y-8">
                        
                        <div className="space-y-4">
                             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-arista-border pb-2">What This Models</h4>
                             <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-slate-300">
                                    <ShieldAlert size={16} className="text-arista-red shrink-0" />
                                    <span><strong>Structural Inefficiency:</strong> The cost of hardware controllers, redundancy licensing, and manual staging required by legacy architectures.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-300">
                                    <Users size={16} className="text-arista-amber shrink-0" />
                                    <span><strong>Operational Friction:</strong> The hidden labor cost of troubleshooting across siloed datasets versus a correlated, system-native view.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-300">
                                    <Zap size={16} className="text-arista-green shrink-0" />
                                    <span><strong>Architectural Savings:</strong> Removing the controller appliance layer creates immediate <Jargon term="CAPEX" definition="Capital Expenditure - the upfront cost of buying physical equipment." /> and power savings.</span>
                                </li>
                             </ul>
                        </div>

                        <div className="space-y-4">
                             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-arista-border pb-2">What This Is Not</h4>
                             <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-slate-400">
                                    <X size={16} className="shrink-0" />
                                    <span>This is not a price quote. All values are industry-standard estimates for illustrative comparison only.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-400">
                                    <X size={16} className="shrink-0" />
                                    <span>It does not account for volume discounts, E-Rate, or specific bundle pricing.</span>
                                </li>
                             </ul>
                        </div>

                        <div className="bg-arista-bg rounded-lg border border-arista-border overflow-hidden">
                             <button 
                                onClick={() => setShowMethodology(!showMethodology)}
                                className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-400 uppercase tracking-wider hover:bg-arista-card/50 transition-colors"
                             >
                                 <span>View Logic</span>
                                 <ChevronDown size={14} className={`transition-transform ${showMethodology ? 'rotate-180' : ''}`} />
                             </button>
                             
                             <AnimatePresence>
                                {showMethodology && (
                                    <motion.div 
                                        initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                        className="bg-arista-card/30 border-t border-arista-border"
                                    >
                                         <div className="p-4 space-y-4 text-xs text-slate-400 font-mono leading-relaxed">
                                            <p>
                                                <strong>Hardware:</strong> Legacy model assumes <Jargon term="HA" definition="High Availability - having backup systems ready to take over if the main one fails." /> Controller pairs per site for resilience. Distributed model requires no controllers.
                                            </p>
                                            <p>
                                                <strong>Staging:</strong> Legacy assumes bench-staging time + shipping. Distributed assumes <Jargon term="Zero Touch Provisioning" definition="A method to set up devices automatically without manual configuration, saving time and reducing errors." /> (drop-ship).
                                            </p>
                                            <p>
                                                <strong>Ops Labor:</strong> Legacy assumes multi-tier escalation path. Distributed assumes lower <Jargon term="MTTI" definition="Mean Time To Innocence / Identify - the time it takes to figure out what's wrong (or prove it's not the network's fault)." /> due to automated root cause analysis.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                        </div>

                        <div className="pt-4 flex items-start gap-2 text-[10px] text-slate-500 font-mono bg-arista-blue/5 p-3 rounded border border-arista-blue/10">
                            <Info size={14} className="shrink-0 text-arista-blue" />
                            Dollar values are illustrative and do not represent vendor list pricing.
                        </div>

                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </Section>
  );
};

// --- SUB COMPONENTS ---

const SliderInput = ({ label, value, min, max, step, onChange, unit }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
      <span>{label}</span>
      <span className="text-white font-bold">{value.toLocaleString()} {unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-arista-border rounded-lg appearance-none cursor-pointer accent-arista-blue"
    />
  </div>
);

const BarSegment = ({ height, color, label, delay, tooltip }: any) => {
    if (height <= 0) return null;
    return (
        <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${height}%`, opacity: 1 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`w-full ${color} relative border-t border-white/10 group/segment`}
        >
            {/* Tooltip on Hover */}
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/segment:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                {tooltip}: {label}
            </div>
            {height > 10 && (
                <div className="absolute inset-0 flex items-center justify-center text-[9px] text-white/90 font-mono font-bold">
                    {label}
                </div>
            )}
        </motion.div>
    );
}

const HorizontalBarSegment = ({ width, color, label, delay, tooltip }: any) => {
    if (width <= 0) return null;
    return (
        <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: `${width}%`, opacity: 1 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`h-full ${color} relative border-l border-white/10 group/segment`}
        >
            {/* Tooltip on Hover */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/segment:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                {tooltip}: {label}
            </div>
            {width > 10 && (
                <div className="absolute inset-0 flex items-center justify-center text-[9px] text-white/90 font-mono font-bold">
                    {label}
                </div>
            )}
        </motion.div>
    );
}