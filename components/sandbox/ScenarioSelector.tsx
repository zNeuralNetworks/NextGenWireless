import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, ListChecks, Map, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../store';
import { SCENARIOS, SCENARIO_ORDER, type ScenarioId } from '../../constants';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arista-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510]';

const difficultyColors = {
  beginner: 'bg-arista-green/10 border-arista-green/30 text-arista-green',
  intermediate: 'bg-arista-amber/10 border-arista-amber/30 text-arista-amber',
  advanced: 'bg-arista-red/10 border-arista-red/30 text-arista-red',
};

const difficultyLabel = {
  beginner: 'Getting Started',
  intermediate: 'Intermediate',
  advanced: 'Deep Dive',
};

const failureLabels = {
  none: 'None',
  cloud: 'Cloud / WAN Loss',
  wan: 'WAN Degraded',
  controller: 'Controller Failure',
};

const applyScenarioDefaults = (id: ScenarioId) => {
  const scenario = SCENARIOS[id];
  useStore.getState().setSandboxConfig({
    sandboxAPs: scenario.initialConfig.sandboxAPs,
    sandboxInterference: scenario.initialConfig.sandboxInterference,
    sandboxStandard: scenario.initialConfig.sandboxStandard,
    sandboxFailure: scenario.initialConfig.sandboxFailure,
  });
};

const OptionButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg border px-3 py-2 text-xs font-mono transition-colors ${focusRing} ${
      active
        ? 'border-arista-blue/50 bg-arista-blue/15 text-white'
        : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-slate-200'
    }`}
  >
    {children}
  </button>
);

const SandboxControls = () => {
  const {
    currentScenario,
    sandboxArchitecture,
    sandboxAPs,
    sandboxStandard,
    sandboxInterference,
    sandboxFailure,
    setSandboxConfig,
  } = useStore();

  return (
    <div className="border-t border-white/10 pt-5">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal size={15} aria-hidden="true" className="text-arista-blue" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Model Inputs</h3>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">Architecture</div>
          <div className="grid grid-cols-2 gap-2">
            <OptionButton
              active={sandboxArchitecture === 'centralized'}
              onClick={() => setSandboxConfig({ sandboxArchitecture: 'centralized' })}
            >
              Centralized
            </OptionButton>
            <OptionButton
              active={sandboxArchitecture === 'edge'}
              onClick={() => setSandboxConfig({ sandboxArchitecture: 'edge' })}
            >
              Edge-Native
            </OptionButton>
          </div>
        </div>

        <label className="block">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">AP Count</span>
            <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-xs text-white">
              {sandboxAPs}
            </span>
          </div>
          <input
            type="range"
            id="sandboxAPs"
            name="sandboxAPs"
            aria-label="AP Count"
            min={10}
            max={250}
            step={5}
            value={sandboxAPs}
            onChange={(event) => setSandboxConfig({ sandboxAPs: Number(event.target.value) })}
            className={`w-full accent-arista-blue ${focusRing}`}
          />
        </label>

        <div>
          <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">Wi-Fi Standard</div>
          <div className="grid grid-cols-2 gap-2">
            <OptionButton
              active={sandboxStandard === 'wifi6'}
              onClick={() => setSandboxConfig({ sandboxStandard: 'wifi6' })}
            >
              Wi-Fi 6
            </OptionButton>
            <OptionButton
              active={sandboxStandard === 'wifi7'}
              onClick={() => setSandboxConfig({ sandboxStandard: 'wifi7' })}
            >
              Wi-Fi 7
            </OptionButton>
          </div>
        </div>

        <div>
          <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">RF Interference</div>
          <div className="grid grid-cols-2 gap-2">
            <OptionButton
              active={sandboxInterference === 'low'}
              onClick={() => setSandboxConfig({ sandboxInterference: 'low' })}
            >
              Low
            </OptionButton>
            <OptionButton
              active={sandboxInterference === 'high'}
              onClick={() => setSandboxConfig({ sandboxInterference: 'high' })}
            >
              High
            </OptionButton>
          </div>
        </div>

        <label className="block">
          <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">Failure Inject</div>
          <select
            id="sandboxFailure"
            name="sandboxFailure"
            aria-label="Failure Inject"
            value={sandboxFailure}
            onChange={(event) => setSandboxConfig({ sandboxFailure: event.target.value as 'none' | 'cloud' | 'wan' | 'controller' })}
            className={`w-full rounded-lg border border-white/10 bg-[#080a12] px-3 py-2 text-xs text-slate-200 transition-colors hover:border-white/20 ${focusRing}`}
          >
            {Object.entries(failureLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {currentScenario && (
          <button
            type="button"
            onClick={() => applyScenarioDefaults(currentScenario)}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-mono text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-200 ${focusRing}`}
          >
            <RotateCcw size={13} aria-hidden="true" />
            Apply Scenario Defaults
          </button>
        )}
      </div>
    </div>
  );
};

export const ScenarioSelector: React.FC = () => {
  const { currentScenario, setCurrentScenario, sandboxArchitecture } = useStore();

  const handleSelectScenario = (id: ScenarioId) => {
    setCurrentScenario(id);
    applyScenarioDefaults(id);
  };

  if (currentScenario) {
    const scenario = SCENARIOS[currentScenario];

    return (
      <aside className="col-span-12 flex min-h-0 flex-col overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-5 lg:col-span-3 lg:max-h-full">
        <button
          type="button"
          onClick={() => setCurrentScenario(null)}
          className={`mb-4 flex items-center gap-2 text-xs text-slate-400 transition-colors hover:text-slate-200 ${focusRing}`}
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to scenarios
        </button>

        <div className="mb-5">
          <div className={`mb-3 inline-block rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide ${difficultyColors[scenario.difficulty]}`}>
            {difficultyLabel[scenario.difficulty]} / ~{scenario.estimatedTime} min
          </div>
          <h2 className="mb-2 text-lg font-bold text-white">{scenario.title}</h2>
          <p className="text-xs text-slate-400">{scenario.deploymentSize}</p>
        </div>

        <div className="mb-5 rounded-lg border border-arista-blue/20 bg-arista-blue/10 p-4">
          <p className="text-sm leading-relaxed text-slate-300">{scenario.description}</p>
        </div>

        <div className="mb-5 rounded-lg border border-white/10 bg-white/5 p-3">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-300">Success Metrics</h3>
          <div className="space-y-2">
            {scenario.goals.map((goal) => (
              <div key={goal.metric} className="flex gap-2 text-xs text-slate-300">
                <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-arista-blue" />
                <span>
                  <strong>{goal.metric}:</strong> {goal.target} {goal.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 border-t border-white/10 pt-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Architecture Comparison</h3>
          <div className="space-y-3">
            <div className={`rounded-lg border p-3 transition-colors ${
              sandboxArchitecture === 'centralized'
                ? 'border-arista-red/30 bg-arista-red/10'
                : 'border-white/10 bg-white/5'
            }`}>
              <p className="mb-1 text-xs font-bold text-red-300">Centralized</p>
              <p className="text-[11px] leading-tight text-slate-400">{scenario.architectureNotes.centralized}</p>
            </div>

            <div className={`rounded-lg border p-3 transition-colors ${
              sandboxArchitecture === 'edge'
                ? 'border-arista-green/30 bg-arista-green/10'
                : 'border-white/10 bg-white/5'
            }`}>
              <p className="mb-1 text-xs font-bold text-green-300">Edge-Native</p>
              <p className="text-[11px] leading-tight text-slate-400">{scenario.architectureNotes.edge}</p>
            </div>
          </div>
        </div>

        <div className="mb-5 border-t border-white/10 pt-4">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">What You Will Learn</h3>
          <ul className="space-y-1.5">
            {scenario.learningPoints.map((point) => (
              <li key={point} className="flex gap-2 text-[11px] text-slate-400">
                <span aria-hidden="true" className="mt-1 text-arista-blue">-</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <SandboxControls />
      </aside>
    );
  }

  return (
    <aside className="col-span-12 flex min-h-0 flex-col overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-5 lg:col-span-3 lg:max-h-full">
      <div className="mb-5 flex items-center gap-2">
        <ListChecks size={16} aria-hidden="true" className="text-arista-blue" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">Guided Scenarios</h2>
      </div>

      <div className="mb-3 flex items-center gap-2 text-xs font-mono text-slate-400">
        <Map size={14} aria-hidden="true" className="text-arista-green" />
        Select a scenario or tune the model inputs.
      </div>
      <p className="mb-6 text-xs leading-relaxed text-slate-500">
        Start from a field scenario, then adjust architecture, scale, RF conditions, and failure mode to see how the outcome changes.
      </p>

      <div className="mb-6 space-y-2">
        {SCENARIO_ORDER.map((scenarioId) => {
          const scenario = SCENARIOS[scenarioId];

          return (
            <motion.button
              key={scenarioId}
              type="button"
              onClick={() => handleSelectScenario(scenarioId)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`group w-full rounded-lg border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-arista-blue/30 hover:bg-white/10 ${focusRing}`}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white transition-colors group-hover:text-arista-blue">
                    {scenario.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">{scenario.deploymentSize}</p>
                </div>
                <ChevronRight size={14} aria-hidden="true" className="mt-0.5 flex-shrink-0 text-slate-500 transition-colors group-hover:text-arista-blue" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-wide ${difficultyColors[scenario.difficulty]}`}>
                  {difficultyLabel[scenario.difficulty]}
                </span>
                <span className="font-mono text-[10px] text-slate-500">~{scenario.estimatedTime} min</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <SandboxControls />
    </aside>
  );
};
