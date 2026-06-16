import React from 'react';
import { motion } from 'framer-motion';
import Network from 'lucide-react/dist/esm/icons/network.js';
import Activity from 'lucide-react/dist/esm/icons/activity.js';
import GitMerge from 'lucide-react/dist/esm/icons/git-merge.js';
import CheckCircle from 'lucide-react/dist/esm/icons/circle-check-big.js';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import Shield from 'lucide-react/dist/esm/icons/shield.js';
import TrendingDown from 'lucide-react/dist/esm/icons/trending-down.js';
import Clock from 'lucide-react/dist/esm/icons/clock.js';
import Zap from 'lucide-react/dist/esm/icons/zap.js';
import { Jargon } from '../ui/Jargon';
import { useStore } from '../../store';

export const AristaDifference: React.FC = () => {
  const { mode } = useStore();

  const architectSteps = [
    {
      id: 'arch',
      title: 'Distributed Architecture',
      desc: 'Removes the centralized controller bottleneck.',
      icon: Network,
      color: 'text-arista-blue',
      border: 'group-hover:border-arista-blue/50'
    },
    {
      id: 'telemetry',
      title: 'Unified Telemetry',
      desc: <><Jargon term="Telemetry" definition="Automated communications process by which measurements and other data are collected at remote or inaccessible points and transmitted to receiving equipment for monitoring." /> aligns wired & wireless state in real-time.</>,
      icon: Activity,
      color: 'text-arista-purple',
      border: 'group-hover:border-arista-purple/50'
    },
    {
      id: 'ops',
      title: 'Correlated Operations',
      desc: 'Replaces manual hunting with algorithmic root cause.',
      icon: GitMerge,
      color: 'text-arista-emerald',
      border: 'group-hover:border-arista-emerald/50'
    },
    {
      id: 'outcomes',
      title: 'Predictable Outcomes',
      desc: 'The network behaves deterministically. It just works.',
      icon: CheckCircle,
      color: 'text-white',
      border: 'group-hover:border-white/50'
    }
  ];

  const executiveSteps = [
    {
      id: 'risk',
      title: 'Risk Mitigation',
      desc: 'Eliminates single points of failure, ensuring business continuity.',
      icon: Shield,
      color: 'text-arista-blue',
      border: 'group-hover:border-arista-blue/50'
    },
    {
      id: 'tco',
      title: 'TCO Reduction',
      desc: 'Lowers operational overhead by automating complex troubleshooting.',
      icon: TrendingDown,
      color: 'text-arista-purple',
      border: 'group-hover:border-arista-purple/50'
    },
    {
      id: 'agility',
      title: 'Operational Agility',
      desc: 'Frees up IT staff to focus on strategic initiatives.',
      icon: Zap,
      color: 'text-arista-emerald',
      border: 'group-hover:border-arista-emerald/50'
    },
    {
      id: 'uptime',
      title: 'Maximum Uptime',
      desc: 'Guarantees reliable connectivity for critical business applications.',
      icon: Clock,
      color: 'text-white',
      border: 'group-hover:border-white/50'
    }
  ];

  const steps = mode === 'executive' ? executiveSteps : architectSteps;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 px-6 relative z-10 border-b border-arista-border/30 bg-arista-bg/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4"
          >
            The Arista Wireless Difference
          </motion.h3>
          <motion.h2 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-3xl md:text-4xl font-bold text-white"
          >
            From Architecture to Outcomes
          </motion.h2>
        </div>

        {/* The Pipeline */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
            
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-linear-to-r from-arista-blue/20 via-arista-purple/20 to-arista-green/20 -z-10" />

            {steps.map((step, idx) => (
                <motion.div
                    key={step.id}
                    variants={item}
                    className="relative group"
                >
                    <div className={`bg-arista-card/80 backdrop-blur border border-arista-border rounded-xl p-6 h-full transition-all duration-300 ${step.border} hover:shadow-xl hover:-translate-y-1`}>
                        
                        {/* Icon Badge */}
                        <div className={`w-12 h-12 rounded-lg bg-arista-bg border border-arista-border flex items-center justify-center mb-6 shadow-lg z-10 relative group-hover:scale-110 transition-transform duration-300`}>
                            <step.icon size={24} className={step.color} />
                        </div>

                        {/* Content */}
                        <h4 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors mb-2">
                            {step.title}
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            {step.desc}
                        </p>
                    </div>

                    {/* Arrow Connector (Desktop) */}
                    {idx < steps.length - 1 && (
                         <div className="hidden lg:flex absolute -right-3 top-12 -translate-y-1/2 z-20 text-slate-600 bg-arista-bg border border-arista-border rounded-full p-1">
                             <ArrowRight size={14} />
                         </div>
                    )}
                    
                    {/* Arrow Connector (Mobile) */}
                    {idx < steps.length - 1 && (
                         <div className="lg:hidden flex justify-center py-4 text-slate-700">
                             <ArrowRight size={20} className="rotate-90" />
                         </div>
                    )}
                </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
};
