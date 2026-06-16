import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../ui/Section';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.js';
import CheckCircle2 from 'lucide-react/dist/esm/icons/circle-check.js';
import XCircle from 'lucide-react/dist/esm/icons/circle-x.js';
import { Jargon } from '../ui/Jargon';
import { useStore } from '../../store';

export const Misconceptions: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const { mode } = useStore();

  const architectItems = [
    {
      id: 'dc-dna',
      myth: "Arista is just a Data Center company. Wireless is an afterthought.",
      reality: <>It is the same engineering DNA. Unlike vendors who acquired disparate wireless stacks, Arista runs a single OS (<Jargon term="EOS" definition="Extensible Operating System - the core software that runs all Arista devices." />) from the Core to the AP. We brought Data Center principles—state streaming, open standards, and high availability—to the wireless edge.</>
    },
    {
      id: 'wan-dependency',
      myth: "Cloud-managed WiFi creates a critical dependency on the WAN.",
      reality: <>False. Arista decouples the Management Plane (Cloud) from the Control Plane (Device). If the internet cuts out, your network doesn't blink. Authentication, fast roaming, and policy enforcement are executed locally on the APs, ensuring 100% survivability.</>
    },
    {
      id: 'ai-commodity',
      myth: "All 'AIOps' platforms are basically the same now.",
      reality: <>AI is only as good as its data. Most competitors train models on polled, averaged <Jargon term="SNMP" definition="Simple Network Management Protocol - an old, slow way of asking devices how they are doing." /> samples ('garbage in, garbage out'). Arista trains on sub-second, state-streaming telemetry. We don't just detect anomalies; we replay the exact event sequence to prove the root cause.</>
    },
    {
      id: 'cloud-depth',
      myth: "Cloud WiFi is great for simplicity, but lacks deep engineering controls.",
      reality: <>Simplicity shouldn't mean blindness. Competitors hide complexity by restricting access to data. Arista abstracts complexity while preserving fidelity. You get the operational ease of a dashboard with the forensic depth of the <Jargon term="CLI" definition="Command Line Interface - a text-based way for engineers to talk directly to the equipment." />—raw logs, packet captures, and state tables—accessible instantly.</>
    }
  ];

  const executiveItems = [
    {
      id: 'cost',
      myth: "Arista is too expensive for our enterprise campus.",
      reality: <>While the initial hardware cost might seem comparable, the true savings lie in the Total Cost of Ownership (TCO). Arista's automated troubleshooting and zero-touch provisioning drastically reduce operational expenses, often paying for the system within the first year.</>
    },
    {
      id: 'risk',
      myth: "Moving to a new vendor introduces too much risk.",
      reality: <>Arista's architecture is designed to mitigate risk. By eliminating the centralized controller (a single point of failure), we ensure that your network remains operational even during upgrades or partial outages, protecting your business continuity.</>
    },
    {
      id: 'lock-in',
      myth: "Cloud-managed solutions lead to vendor lock-in.",
      reality: <>Arista champions open standards. Our Extensible Operating System (<Jargon term="EOS" definition="Extensible Operating System - the core software that runs all Arista devices." />) provides open APIs, allowing you to integrate with your existing tools and avoid being trapped in a proprietary ecosystem.</>
    },
    {
      id: 'complexity',
      myth: "Our IT team doesn't have the skills to manage a new system.",
      reality: <>Arista's CloudVision platform simplifies management. It translates complex network data into actionable insights, empowering your existing team to resolve issues faster without needing specialized, vendor-specific certifications.</>
    }
  ];

  const items = mode === 'executive' ? executiveItems : architectItems;

  return (
    <Section id="misconceptions" title="Common Misconceptions" subtitle="Separating operational reality from legacy marketing myths.">
      <div className="max-w-4xl mx-auto grid gap-4">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id}
                className={`group rounded-lg border transition-all duration-300 ${isOpen ? 'bg-arista-card border-arista-blue/50 ring-1 ring-arista-blue/20' : 'bg-arista-card/20 border-arista-border hover:bg-arista-card/40'}`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${isOpen ? 'bg-arista-red/10 text-arista-red' : 'bg-slate-800 text-slate-500 group-hover:text-slate-400'}`}>
                        <XCircle size={20} />
                    </div>
                    <span className={`text-sm md:text-base font-medium ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      "{item.myth}"
                    </span>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-arista-blue' : ''}`} 
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                      }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-6 pb-6 pl-4 md:pl-[4.5rem]">
                         <div className="flex items-start gap-4 pt-4 border-t border-arista-border/50">
                            <div className="mt-1 hidden md:block">
                                <CheckCircle2 size={20} className="text-arista-green" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 size={16} className="text-arista-green md:hidden" />
                                  <span className="text-xs font-bold text-arista-green uppercase tracking-widest block">The Reality</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    {item.reality}
                                </p>
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
      </div>
    </Section>
  );
};
