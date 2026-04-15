import React from 'react';
import { useStore } from '../../store';
import { SCENARIOS } from '../../constants';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScenarioFeedbackProps {
  running: boolean;
  liveLatency: number;
  livePktLoss: number;
}

export const ScenarioFeedback: React.FC<ScenarioFeedbackProps> = ({ running, liveLatency, livePktLoss }) => {
  const { currentScenario, sandboxArchitecture, sandboxAPs, sandboxFailure, sandboxInterference, sandboxStandard } = useStore();

  if (!currentScenario || !running) return null;

  const scenario = SCENARIOS[currentScenario];
  const isEdge = sandboxArchitecture === 'edge';

  // Extract the leading numeric value from goal targets like "<10ms", "0%", ">95%"
  const extractNumeric = (target: string | number): number => {
    if (typeof target === 'number') return target;
    const match = target.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Determine whether the goal is an upper-bound (<=) or lower-bound (>=) check
  const isUpperBound = (target: string | number): boolean =>
    typeof target === 'number' || !String(target).startsWith('>');

  // Match any latency-related goal regardless of exact metric name
  const latencyGoal = scenario.goals.find(g =>
    g.metric.toLowerCase().includes('latency')
  );
  const pktLossGoal = scenario.goals.find(g => g.metric === 'Packet Loss');

  let latencyMet = true;
  let pktLossMet = true;

  if (latencyGoal) {
    const targetMs = extractNumeric(latencyGoal.target);
    if (!isNaN(targetMs)) {
      latencyMet = isUpperBound(latencyGoal.target)
        ? liveLatency <= targetMs
        : liveLatency >= targetMs;
    }
  }

  if (pktLossGoal) {
    const targetPct = extractNumeric(pktLossGoal.target);
    if (!isNaN(targetPct)) {
      pktLossMet = isUpperBound(pktLossGoal.target)
        ? livePktLoss <= targetPct
        : livePktLoss >= targetPct;
    }
  }

  const goalsMet = latencyMet && pktLossMet;
  const rootCause = sandboxArchitecture === 'centralized' && sandboxAPs > 30
    ? 'Centralized control saturates as AP scale rises; roaming and policy decisions queue behind the controller.'
    : sandboxArchitecture === 'centralized' && sandboxFailure !== 'none'
      ? 'The active failure removes a centralized dependency, so the management/control path becomes the fault domain.'
      : sandboxInterference === 'high' && sandboxStandard !== 'wifi7'
        ? 'High RF interference has no alternate MLO path, so latency and loss rise at the client edge.'
        : sandboxInterference === 'high' && sandboxStandard === 'wifi7'
          ? 'Wi-Fi 7 MLO preserves service by shifting traffic across available bands.'
          : sandboxArchitecture === 'edge'
            ? 'Edge-native forwarding keeps data-plane decisions local to the AP cluster.'
            : 'Current inputs do not trigger a major modeled failure.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      aria-live="polite"
      className={`mt-4 p-4 rounded-lg border transition-colors ${
        goalsMet
          ? 'bg-arista-green/10 border-arista-green/30'
          : 'bg-arista-red/10 border-arista-red/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {goalsMet ? (
          <CheckCircle size={16} className="text-arista-green flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle size={16} className="text-arista-red flex-shrink-0 mt-0.5" />
        )}

        <div className="flex-1">
          <h3 className={`text-sm font-bold mb-2 ${goalsMet ? 'text-arista-green' : 'text-arista-red'}`}>
            {goalsMet ? 'Goals Met' : 'Goals Not Met'}
          </h3>

          <div className="space-y-1 text-xs text-slate-300 mb-3">
            {latencyGoal && (
              <p className={latencyMet ? 'text-arista-green' : 'text-arista-red'}>
                Latency: {liveLatency.toFixed(1)}ms {latencyMet ? '(goal met)' : `(goal: ${latencyGoal.target})`}
              </p>
            )}
            {pktLossGoal && (
              <p className={pktLossMet ? 'text-arista-green' : 'text-arista-red'}>
                Packet Loss: {livePktLoss}% {pktLossMet ? '(goal met)' : `(goal: ${pktLossGoal.target})`}
              </p>
            )}
          </div>

          <p className="mb-2 text-[11px] text-slate-400 leading-relaxed">
            {isEdge ? (
              <>
                <strong>Edge-Native Insight:</strong> {scenario.architectureNotes.edge}
              </>
            ) : (
              <>
                <strong>Centralized Challenge:</strong> {scenario.architectureNotes.centralized}
              </>
            )}
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            <strong>Root Cause:</strong> {rootCause}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
