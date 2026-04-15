import React from 'react';
import { Hero } from './Hero';
import { Manifesto } from './Manifesto';
import { AristaDifference } from './AristaDifference';
import { FiveBehaviors } from './FiveBehaviors';
import { CompetitiveGrid } from './CompetitiveGrid';
import { Misconceptions } from './Misconceptions';
import { ArchitecturalParadox } from './ArchitecturalParadox';
import { ZTP } from './ZTP';
import { ROICalculator } from './ROICalculator';
import { FailureResilience } from './FailureResilience';
import { SecurityEdge } from './SecurityEdge';
import { SupportAdvantage } from './SupportAdvantage';
import { Wifi7Physics } from './Wifi7Physics';
import { useStore } from '../../store';

export const LandingPage = () => {
    const setActiveView = useStore((state) => state.setActiveView);

    return (
        <>
            <Hero />
            <Manifesto />
            <AristaDifference />
            <ArchitecturalParadox />
            <FiveBehaviors />
            <ZTP />
            <FailureResilience />
            <Wifi7Physics />
            <CompetitiveGrid />
            <ROICalculator />
            <SecurityEdge />
            <SupportAdvantage />
            <Misconceptions />

            <div className="flex flex-col items-center my-16 px-6">
                <button
                    className="glass-card px-8 py-4 rounded-lg bg-arista-blue/90 text-white font-heading text-2xl shadow-lg hover:scale-105 transition-transform duration-200"
                    onClick={() => setActiveView('sandbox')}
                >
                    Pick your challenge
                </button>
                <span className="mt-3 text-arista-blue/80 font-heading text-lg text-center">
                    Jump into the Architecture Scenario Engine
                </span>
            </div>
            
            <footer className="py-24 border-t border-arista-border text-center text-slate-400 text-sm bg-arista-bg/50 backdrop-blur-sm px-6">
                <p className="mb-2 font-mono uppercase tracking-wider text-xs text-slate-500">Community Project</p>
                <p className="text-xs text-slate-500 max-w-lg mx-auto mb-4">
                Disclaimer: This is an independent, community-driven educational visualization. It is not officially affiliated with, endorsed by, or a product of Arista Networks. All trademarks belong to their respective owners.
                </p>
                <p className="text-[10px] text-slate-600 font-mono">
                Diagrams and explanations may be reused for internal presentations with attribution to Theo Rajan.
                </p>
            </footer>
        </>
    )
}
