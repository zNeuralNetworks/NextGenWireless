import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useStore } from '../../store';
import { SCENARIOS } from '../../constants';
import Columns2 from 'lucide-react/dist/esm/icons/columns-2.js';
import Network from 'lucide-react/dist/esm/icons/network.js';
import Play from 'lucide-react/dist/esm/icons/play.js';
import RotateCcw from 'lucide-react/dist/esm/icons/rotate-ccw.js';
import Square from 'lucide-react/dist/esm/icons/square.js';
import { TerminalOutput } from '../ui/TerminalOutput';
import { ScenarioSelector } from './ScenarioSelector';
import { ScenarioFeedback } from './ScenarioFeedback';

// ── Fixed SVG canvas coordinate system ──────────────────────────────────────
const W = 800, H = 460;
const WLC  = { x: 400, y: 88  };
const AP_A = { x: 188, y: 268 };
const AP_B = { x: 612, y: 268 };
const CLI  = { x: 400, y: 418 };

// Connection paths
const P_WLC_A  = `M 400 125 L 188 230`;
const P_WLC_B  = `M 400 125 L 612 230`;
const P_A_WLC  = `M 188 230 L 400 125`;
const P_B_WLC  = `M 612 230 L 400 125`;
const P_A_CLI  = `M 188 302 L 382 390`;
const P_B_CLI  = `M 612 302 L 418 390`;
const P_CLI_A  = `M 382 390 L 188 302`;
const P_CLI_B  = `M 418 390 L 612 302`;
const P_MESH_AB = `M 222 268 L 578 268`;
const P_MESH_BA = `M 578 268 L 222 268`;
const P_MLO_A_CLI = `M 200 302 L 376 390`;
const P_MLO_B_CLI = `M 600 302 L 424 390`;

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arista-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510]';

const getWorkloadLabel = (scenarioId: string | null) => {
    switch (scenarioId) {
        case 'campus':   return 'VOICE / VIDEO ROAMING';
        case 'branch':   return 'BRANCH POS CLIENTS';
        case 'stadium':  return 'DENSE VENUE CLIENTS';
        case 'regional': return 'REGIONAL USERS';
        case 'highrise': return 'FLOOR-TO-FLOOR ROAMING';
        default:         return 'CLIENT WORKLOAD';
    }
};

const LegendItem = ({ color, lineClass, label }: { color: string; lineClass: string; label: string }) => (
    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wide text-slate-400">
        <span
            className={`h-0.5 w-8 ${lineClass}`}
            style={{ backgroundColor: lineClass.includes('bg-transparent') ? 'transparent' : color, borderColor: color }}
            aria-hidden="true"
        />
        <span>{label}</span>
    </div>
);

// ── TopologyCanvas ────────────────────────────────────────────────────────────

interface TopologyCanvasProps {
    isEdge: boolean;
    isOverloaded: boolean;
    isIsolated: boolean;
    isRfCongested: boolean;
    isMloActive: boolean;
    hasRfFailure: boolean;
    hasAnyFailure: boolean;
    canAnimate: boolean;
    running: boolean;
    sandboxAPs: number;
    liveLatency: number;
    livePktLoss: number;
    workloadLabel: string;
    archLabel?: string; // shown as a badge overlay in compare mode
}

const TopologyCanvas = ({
    isEdge, isOverloaded, isIsolated, isRfCongested, isMloActive,
    hasRfFailure, hasAnyFailure, canAnimate, running,
    sandboxAPs, liveLatency, livePktLoss, workloadLabel, archLabel,
}: TopologyCanvasProps) => {
    const wlcStroke = isIsolated ? '#ef4444' : isEdge ? '#a855f7' : '#3b82f6';
    const apStroke  = isOverloaded ? '#ef4444' : isEdge ? '#10b981' : '#3b82f6';
    const cliStroke = hasRfFailure ? '#ef4444' : (isMloActive && isRfCongested) ? '#9333ea' : '#475569';
    const rfColor   = hasRfFailure ? '#ef4444' : (isMloActive && isRfCongested) ? '#9333ea' : '#3b82f6';
    const mgmtColor = isIsolated ? '#ef4444' : '#a855f7';
    const canvasId  = isEdge ? 'edge' : 'central';

    return (
        <div className={`flex-1 rounded-xl border relative overflow-x-auto overflow-y-hidden transition-colors duration-1000 min-h-[300px] lg:min-h-[280px] ${hasAnyFailure && running ? 'border-arista-red/20' : isEdge ? 'border-arista-blue/15' : 'border-white/10'}`}>

            {/* Architecture label badge (compare mode) */}
            {archLabel && (
                <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-widest pointer-events-none ${
                    isEdge
                        ? 'border-arista-green/40 bg-[#050510]/80 text-arista-green'
                        : 'border-arista-blue/40 bg-[#050510]/80 text-arista-blue'
                }`}>
                    {archLabel}
                </div>
            )}

            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                style={{ opacity: hasAnyFailure && running ? 1 : 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(239,68,68,0.06) 0%, transparent 70%)' }} />
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                style={{ opacity: isEdge && !hasAnyFailure ? 1 : 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(16,185,129,0.05) 0%, transparent 70%)' }} />

            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full min-w-[480px] lg:min-w-0" preserveAspectRatio="xMidYMid meet"
                role="img" aria-labelledby={`topo-title-${canvasId}`} aria-describedby={`topo-desc-${canvasId}`}>
                <title id={`topo-title-${canvasId}`}>{isEdge ? 'Edge-Native' : 'Centralized'} architecture topology</title>
                <desc id={`topo-desc-${canvasId}`}>
                    {`${isEdge ? 'Edge-Native' : 'Centralized'} topology. Control plane: ${isEdge ? 'CloudVision management only' : isIsolated ? 'Controller unreachable' : 'Controller carries data and management'}. Data plane: ${isEdge ? 'Autonomous edge forwarding' : isIsolated ? 'Centralized data path degraded' : 'Forwarding through centralized dependency'}. Workload: ${workloadLabel}.`}
                </desc>
                <defs>
                    <filter id={`sb-blue-${canvasId}`}   x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    <filter id={`sb-red-${canvasId}`}    x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    <filter id={`sb-green-${canvasId}`}  x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    <filter id={`sb-purple-${canvasId}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    <filter id={`sb-heavy-${canvasId}`}  x="-80%" y="-80%" width="360%" height="360%"><feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    <pattern id={`sb-grid-${canvasId}`} width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1"/>
                    </pattern>
                </defs>

                {/* Background grid */}
                <rect width={W} height={H} fill={`url(#sb-grid-${canvasId})`} />

                {/* ── Ambient node halos ── */}
                <circle cx={WLC.x}  cy={WLC.y}  r="65"  fill={wlcStroke} opacity="0.04" filter={`url(#sb-heavy-${canvasId})`} />
                <circle cx={AP_A.x} cy={AP_A.y} r="55"  fill={apStroke}  opacity="0.05" filter={`url(#sb-heavy-${canvasId})`} />
                <circle cx={AP_B.x} cy={AP_B.y} r="55"  fill={apStroke}  opacity="0.05" filter={`url(#sb-heavy-${canvasId})`} />
                <circle cx={CLI.x}  cy={CLI.y}  r="50"  fill={cliStroke} opacity="0.06" filter={`url(#sb-heavy-${canvasId})`} />

                {/* Management plane: WLC ↔ APs */}
                <path d={P_WLC_A} fill="none" stroke={mgmtColor} strokeWidth={isEdge ? 1 : 2} strokeDasharray="5 5"
                    opacity={isIsolated ? 0.8 : isEdge ? 0.25 : 0.5}
                    filter={isIsolated ? `url(#sb-red-${canvasId})` : undefined} />
                <path d={P_WLC_B} fill="none" stroke={mgmtColor} strokeWidth={isEdge ? 1 : 2} strokeDasharray="5 5"
                    opacity={isIsolated ? 0.8 : isEdge ? 0.25 : 0.5}
                    filter={isIsolated ? `url(#sb-red-${canvasId})` : undefined} />

                {/* RF links: APs → Client */}
                <path d={P_A_CLI} fill="none" stroke={rfColor} strokeWidth={hasRfFailure ? 1.5 : 2.5}
                    strokeDasharray={hasRfFailure ? '3 3' : '7 4'} opacity={hasRfFailure ? 0.45 : 0.65}
                    filter={hasRfFailure ? `url(#sb-red-${canvasId})` : `url(#sb-blue-${canvasId})`} />
                <path d={P_B_CLI} fill="none" stroke={rfColor} strokeWidth={hasRfFailure ? 1.5 : 2.5}
                    strokeDasharray={hasRfFailure ? '3 3' : '7 4'} opacity={hasRfFailure ? 0.45 : 0.65}
                    filter={hasRfFailure ? `url(#sb-red-${canvasId})` : `url(#sb-blue-${canvasId})`} />

                {/* MLO secondary 6 GHz paths */}
                {isMloActive && (
                    <>
                        <path d={P_MLO_A_CLI} fill="none" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.5" filter={`url(#sb-purple-${canvasId})`} />
                        <path d={P_MLO_B_CLI} fill="none" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.5" filter={`url(#sb-purple-${canvasId})`} />
                    </>
                )}

                {/* L2 mesh (edge mode) */}
                {isEdge && (
                    <path d={P_MESH_AB} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" opacity="0.55" filter={`url(#sb-green-${canvasId})`} />
                )}

                {/* ── Animated particles ── */}
                {canAnimate && !isIsolated && (
                    <>
                        <circle r="3" fill="#a855f7" filter={`url(#sb-purple-${canvasId})`} opacity="0.85">
                            <animateMotion dur="2.2s" repeatCount="indefinite" path={P_A_WLC} />
                        </circle>
                        <circle r="3" fill="#a855f7" filter={`url(#sb-purple-${canvasId})`} opacity="0.85">
                            <animateMotion dur="2.5s" repeatCount="indefinite" path={P_B_WLC} />
                        </circle>
                        {!isEdge && (
                            <>
                                <circle r="2.5" fill="#3b82f6" filter={`url(#sb-blue-${canvasId})`} opacity="0.8">
                                    <animateMotion dur="3.2s" repeatCount="indefinite" path={P_WLC_A} />
                                </circle>
                                <circle r="2.5" fill="#3b82f6" filter={`url(#sb-blue-${canvasId})`} opacity="0.8">
                                    <animateMotion dur="3.8s" repeatCount="indefinite" path={P_WLC_B} />
                                </circle>
                            </>
                        )}
                    </>
                )}
                {canAnimate && !hasRfFailure && (
                    <>
                        <circle r="3.5" fill={isEdge ? '#10b981' : '#3b82f6'} filter={isEdge ? `url(#sb-green-${canvasId})` : `url(#sb-blue-${canvasId})`} opacity="0.9">
                            <animateMotion dur="1.3s" repeatCount="indefinite" path={P_A_CLI} />
                        </circle>
                        <circle r="3.5" fill={isEdge ? '#10b981' : '#3b82f6'} filter={isEdge ? `url(#sb-green-${canvasId})` : `url(#sb-blue-${canvasId})`} opacity="0.9">
                            <animateMotion dur="1.5s" repeatCount="indefinite" path={P_B_CLI} />
                        </circle>
                        <circle r="2" fill={isEdge ? '#10b981' : '#60a5fa'} opacity="0.5">
                            <animateMotion dur="2s" repeatCount="indefinite" path={P_CLI_A} />
                        </circle>
                        <circle r="2" fill={isEdge ? '#10b981' : '#60a5fa'} opacity="0.5">
                            <animateMotion dur="2.2s" repeatCount="indefinite" path={P_CLI_B} />
                        </circle>
                        {isMloActive && (
                            <>
                                <circle r="2.5" fill="#c084fc" filter={`url(#sb-purple-${canvasId})`} opacity="0.8">
                                    <animateMotion dur="0.7s" repeatCount="indefinite" path={P_MLO_A_CLI} />
                                </circle>
                                <circle r="2.5" fill="#c084fc" filter={`url(#sb-purple-${canvasId})`} opacity="0.8">
                                    <animateMotion dur="0.85s" repeatCount="indefinite" path={P_MLO_B_CLI} />
                                </circle>
                            </>
                        )}
                    </>
                )}
                {canAnimate && isEdge && (
                    <>
                        <circle r="3" fill="#10b981" filter={`url(#sb-green-${canvasId})`} opacity="0.9">
                            <animateMotion dur="1.8s" repeatCount="indefinite" path={P_MESH_AB} />
                        </circle>
                        <circle r="3" fill="#10b981" filter={`url(#sb-green-${canvasId})`} opacity="0.9">
                            <animateMotion dur="1.8s" begin="0.9s" repeatCount="indefinite" path={P_MESH_BA} />
                        </circle>
                    </>
                )}

                {/* ══ WLC NODE ══ */}
                <g transform={`translate(${WLC.x}, ${WLC.y})`}>
                    {canAnimate && !isIsolated && (
                        <circle cx="0" cy="0" r="44" fill="none" stroke={wlcStroke} strokeWidth="1" opacity="0.25">
                            <animate attributeName="r"       values="42;54;42" dur="3s"   repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.25;0;0.25" dur="3s" repeatCount="indefinite" />
                        </circle>
                    )}
                    <rect x="-48" y="-36" width="96" height="72" rx="8"
                        fill="#07080f" stroke={wlcStroke} strokeWidth={isIsolated ? 2.5 : 1.5}
                        filter={isIsolated ? `url(#sb-red-${canvasId})` : undefined} />
                    {[-26, -8, 10].map((y, i) => (
                        <g key={i}>
                            <rect x="-38" y={y} width="76" height="14" rx="2" fill="#0d1117" stroke={isIsolated ? '#ef444428' : '#1e293b'} strokeWidth="1" />
                            <rect x="-34" y={y + 3} width={isOverloaded ? 70 : 22 + i * 8} height="8" rx="1"
                                fill={isOverloaded ? '#ef444440' : isIsolated ? '#33333350' : '#3b82f620'} />
                            <circle cx="26" cy={y + 7} r="2.5" fill={isIsolated ? '#ef4444' : i === 2 ? '#3b82f6' : '#22c55e'} opacity={isIsolated ? 1 : 0.9}>
                                {canAnimate && !isIsolated && <animate attributeName="opacity" values="0.9;0.3;0.9" dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite" />}
                            </circle>
                        </g>
                    ))}
                    {isOverloaded && [-60, -70, -80].map((x, i) => (
                        <circle key={i} cx={x} cy="-3" r="3" fill="#ef4444" opacity={1 - i * 0.3}>
                            {canAnimate && <animate attributeName="opacity" values={`${1 - i * 0.3};0.1;${1 - i * 0.3}`} dur="0.8s" begin={`${i * 0.2}s`} repeatCount="indefinite" />}
                        </circle>
                    ))}
                    {isIsolated && (
                        <>
                            <line x1="-36" y1="-28" x2="36" y2="28" stroke="#ef4444" strokeWidth="2.5" opacity="0.7" filter={`url(#sb-red-${canvasId})`} />
                            <line x1="36"  y1="-28" x2="-36" y2="28" stroke="#ef4444" strokeWidth="2.5" opacity="0.7" filter={`url(#sb-red-${canvasId})`} />
                        </>
                    )}
                    <text y="50" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace" letterSpacing="1">
                        {isEdge ? 'CLOUDVISION' : 'WLAN CONTROLLER'}
                    </text>
                    <text y="62" textAnchor="middle" fill={isEdge ? '#a855f7' : isIsolated ? '#ef4444' : '#475569'} fontSize="8" fontFamily="monospace" letterSpacing="2">
                        {isEdge ? 'MGMT ONLY' : isIsolated ? 'UNREACHABLE' : 'DATA + MGMT'}
                    </text>
                </g>

                {/* ══ AP NODES ══ */}
                {([
                    { pos: AP_A, label: 'AP GROUP A', delay: '0s'    },
                    { pos: AP_B, label: 'AP GROUP B', delay: '0.45s' },
                ] as const).map(({ pos, label, delay }) => (
                    <g key={label} transform={`translate(${pos.x}, ${pos.y})`}>
                        {canAnimate && !isOverloaded && (
                            <circle cx="0" cy="0" r="38" fill="none" stroke={apStroke} strokeWidth="1" opacity="0.2">
                                <animate attributeName="r"       values="35;46;35"     dur="2.6s" begin={delay} repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.22;0;0.22"  dur="2.6s" begin={delay} repeatCount="indefinite" />
                            </circle>
                        )}
                        {isOverloaded && (
                            <circle cx="0" cy="0" r="40" fill="none" stroke="#ef4444" strokeWidth="2" filter={`url(#sb-red-${canvasId})`}>
                                {canAnimate && <animate attributeName="r"       values="36;50;36" dur="1s" begin={delay} repeatCount="indefinite" />}
                                {canAnimate && <animate attributeName="opacity" values="0.9;0;0.9" dur="1s" begin={delay} repeatCount="indefinite" />}
                            </circle>
                        )}
                        <path d="M -24 -6 Q 0 -46 24 -6" fill="none" stroke={isOverloaded ? '#ef4444' : apStroke} strokeWidth="2" strokeLinecap="round"
                            opacity={isOverloaded ? 1 : 0.65} filter={isOverloaded ? `url(#sb-red-${canvasId})` : isEdge ? `url(#sb-green-${canvasId})` : `url(#sb-blue-${canvasId})`} />
                        <path d="M -14 -6 Q 0 -28 14 -6" fill="none" stroke={isOverloaded ? '#ef4444' : apStroke} strokeWidth="2.5" strokeLinecap="round"
                            opacity={isOverloaded ? 1 : 0.85} />
                        <circle cx="0" cy="-6" r="3.5" fill={isOverloaded ? '#ef4444' : apStroke}
                            filter={isEdge ? `url(#sb-green-${canvasId})` : `url(#sb-blue-${canvasId})`} />
                        <rect x="-32" y="-4" width="64" height="34" rx="7"
                            fill="#07080f" stroke={isOverloaded ? '#ef4444' : apStroke} strokeWidth={isOverloaded ? 2 : 1.5}
                            filter={isOverloaded ? `url(#sb-red-${canvasId})` : undefined} />
                        {isEdge && !isOverloaded && (
                            <>
                                <circle cx="-10" cy="13" r="5" fill="none" stroke="#10b981" strokeWidth="1.2" opacity="0.85" />
                                <path d="M -13 13 C -13 9 -7 9 -7 13 C -7 17 -13 17 -13 13 Z" fill="#10b981" opacity="0.3" />
                                <text x="0" y="17" fill="#10b981" fontSize="7.5" fontFamily="monospace" letterSpacing="1">EDGE</text>
                            </>
                        )}
                        {isOverloaded && (
                            <text x="0" y="17" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="bold">OVERLOAD</text>
                        )}
                        {!isEdge && !isOverloaded && (
                            <>
                                <rect x="-20" y="6" width="40" height="5" rx="1" fill="#1e293b" />
                                <rect x="-20" y="6" width={`${Math.min(sandboxAPs / 1.5, 40)}`} height="5" rx="1" fill="#3b82f6" opacity="0.6" />
                            </>
                        )}
                        <text y="44" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">{label}</text>
                        <text y="56" textAnchor="middle" fill={isOverloaded ? '#ef4444' : '#475569'} fontSize="8" fontFamily="monospace">×{Math.round(sandboxAPs / 2)} units</text>
                    </g>
                ))}

                {/* L2 mesh label */}
                {isEdge && (
                    <text x={W / 2} y={AP_A.y - 14} textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace" letterSpacing="3" opacity="0.65">
                        STATE SYNC (L2 MESH)
                    </text>
                )}

                {/* ══ CLIENT NODE ══ */}
                <g transform={`translate(${CLI.x}, ${CLI.y})`}>
                    {canAnimate && !hasRfFailure && (
                        <circle cx="0" cy="0" r="40" fill="none" stroke={cliStroke} strokeWidth="1" opacity="0.2">
                            <animate attributeName="r"       values="37;48;37"     dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.2;0;0.2"    dur="2s" repeatCount="indefinite" />
                        </circle>
                    )}
                    {hasRfFailure && canAnimate && (
                        <circle cx="0" cy="0" r="44" fill="none" stroke="#ef4444" strokeWidth="2.5" filter={`url(#sb-red-${canvasId})`}>
                            <animate attributeName="r"       values="40;52;40" dur="0.7s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="1;0;1"    dur="0.7s" repeatCount="indefinite" />
                        </circle>
                    )}
                    <polygon points="0,-33 28,-16.5 28,16.5 0,33 -28,16.5 -28,-16.5"
                        fill="#07080f" stroke={cliStroke} strokeWidth={hasRfFailure ? 2.5 : 1.5}
                        filter={hasRfFailure ? `url(#sb-red-${canvasId})` : (isMloActive && isRfCongested) ? `url(#sb-purple-${canvasId})` : undefined} />
                    {!hasRfFailure ? (
                        <path d="M -18 0 L -9 -14 L 0 14 L 9 -14 L 18 0"
                            fill="none" stroke={(isMloActive && isRfCongested) ? '#c084fc' : '#3b82f6'}
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            filter={(isMloActive && isRfCongested) ? `url(#sb-purple-${canvasId})` : `url(#sb-blue-${canvasId})`} />
                    ) : (
                        <>
                            <line x1="-15" y1="-15" x2="15" y2="15" stroke="#ef4444" strokeWidth="3" filter={`url(#sb-red-${canvasId})`} />
                            <line x1="15"  y1="-15" x2="-15" y2="15" stroke="#ef4444" strokeWidth="3" filter={`url(#sb-red-${canvasId})`} />
                        </>
                    )}
                    {isMloActive && !hasRfFailure && (
                        <>
                            <rect x="15" y="-37" width="26" height="13" rx="3" fill="#3b0764" stroke="#9333ea" strokeWidth="1" />
                            <text x="28" y="-27" textAnchor="middle" fill="#c084fc" fontSize="7.5" fontFamily="monospace" fontWeight="bold">MLO</text>
                        </>
                    )}
                    <rect x="-26" y="38" width="52" height="17" rx="4"
                        fill={hasRfFailure || (running && liveLatency > 50) ? '#450a0a' : '#0d1117'}
                        stroke={hasRfFailure || (running && liveLatency > 50) ? '#ef4444' : '#1e293b'} strokeWidth="1" />
                    <text x="0" y="50" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="bold"
                        fill={hasRfFailure || (running && liveLatency > 50) ? '#ef4444' : '#22c55e'}>
                        {running ? `${liveLatency.toFixed(0)}ms` : '—'}
                    </text>
                    <text y="68" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">{workloadLabel}</text>
                    <text y="80" textAnchor="middle" fontSize="8" fontFamily="monospace"
                        fill={hasRfFailure ? '#ef4444' : '#22c55e'}>
                        {hasRfFailure ? 'OFFLINE (JITTER > 400ms)' : 'NOMINAL (JITTER < 2ms)'}
                    </text>
                </g>

                {/* ── Data plane foundation bar ── */}
                <g transform={`translate(0, ${H - 28})`}>
                    <rect x="60" y="0" width={W - 120} height="6" rx="3" fill="#0f172a" />
                    <rect x="60" y="0" width="110" height="6" rx="3"
                        fill={(isIsolated && !isEdge) ? '#334155' : isEdge ? '#10b981' : '#3b82f6'} opacity="0.8">
                        {canAnimate && (!isIsolated || isEdge) && (
                            <animate attributeName="x" values="60;590;60" dur={isEdge ? '1.4s' : '3s'} repeatCount="indefinite" />
                        )}
                    </rect>
                    <text x={W / 2} y="20" textAnchor="middle" fontFamily="monospace" fontSize="9" letterSpacing="3" fontWeight="bold"
                        fill={isEdge ? '#10b981' : isIsolated ? '#475569' : '#334155'}>
                        DATA PLANE ({isEdge ? 'AUTONOMOUS' : isIsolated ? 'DEGRADED' : 'FORWARDING'})
                    </text>
                </g>
            </svg>
        </div>
    );
};

// ── CompareDeltaStrip ─────────────────────────────────────────────────────────

interface CompareDeltaStripProps {
    running: boolean;
    centralLatency: number;
    centralPktLoss: number;
    centralHasFailure: boolean;
    edgeLatency: number;
    edgePktLoss: number;
    edgeHasFailure: boolean;
}

const CompareDeltaStrip = ({
    running, centralLatency, centralPktLoss, centralHasFailure,
    edgeLatency, edgePktLoss, edgeHasFailure,
}: CompareDeltaStripProps) => {
    const latencyDelta = running && centralHasFailure && !edgeHasFailure && edgeLatency > 0
        ? `${Math.round(centralLatency / edgeLatency)}×`
        : running && !centralHasFailure && !edgeHasFailure
            ? '≈1×'
            : '—';
    const deltaPositive = running && centralHasFailure && !edgeHasFailure;

    return (
        <div aria-live="polite" className="grid grid-cols-[1fr_auto_1fr] gap-0 rounded-xl border border-white/10 bg-white/[0.02] font-mono text-xs overflow-hidden">
            {/* Centralized column */}
            <div className="p-3">
                <div className="mb-1.5 text-[9px] uppercase tracking-widest text-arista-blue">Centralized</div>
                <div className={`text-lg font-bold leading-none ${running && centralHasFailure ? 'text-arista-red' : 'text-white'}`}>
                    {running ? `${centralLatency.toFixed(0)}ms` : '—'}
                </div>
                <div className={`mt-1 text-[10px] ${running && centralPktLoss > 0 ? 'text-arista-red' : 'text-slate-500'}`}>
                    {running ? `${centralPktLoss}% pkt loss` : 'latency'}
                </div>
                <div className={`mt-1 text-[9px] uppercase tracking-wide ${centralHasFailure ? 'text-arista-red' : 'text-arista-green'}`}>
                    {centralHasFailure ? '● DEGRADED' : '● NOMINAL'}
                </div>
            </div>

            {/* Delta column */}
            <div className="flex flex-col items-center justify-center px-4 border-x border-white/10 text-center gap-0.5">
                <div className="text-[9px] uppercase tracking-widest text-slate-600">DELTA</div>
                <div className={`text-xl font-bold ${deltaPositive ? 'text-arista-green' : 'text-slate-500'}`}>
                    {latencyDelta}
                </div>
                <div className="text-[9px] text-slate-600">faster</div>
            </div>

            {/* Edge column */}
            <div className="p-3 text-right">
                <div className="mb-1.5 text-[9px] uppercase tracking-widest text-arista-green">Edge-Native</div>
                <div className={`text-lg font-bold leading-none ${running && edgeHasFailure ? 'text-arista-red' : 'text-arista-green'}`}>
                    {running ? `${edgeLatency.toFixed(1)}ms` : '—'}
                </div>
                <div className={`mt-1 text-[10px] ${running && edgePktLoss > 0 ? 'text-arista-red' : 'text-slate-500'}`}>
                    {running ? `${edgePktLoss}% pkt loss` : 'latency'}
                </div>
                <div className={`mt-1 text-[9px] uppercase tracking-wide ${edgeHasFailure ? 'text-arista-red' : 'text-arista-green'}`}>
                    {edgeHasFailure ? '● DEGRADED' : '● NOMINAL'}
                </div>
            </div>
        </div>
    );
};

// ── ArchitectureSandbox ───────────────────────────────────────────────────────

export const ArchitectureSandbox = () => {
    const {
        currentScenario,
        sandboxArchitecture, setSandboxConfig,
        sandboxAPs, sandboxFailure,
        sandboxStandard, sandboxInterference,
    } = useStore();
    const prefersReducedMotion = useReducedMotion();

    // Single-mode state
    const [syslogs,     setSyslogs]     = useState<string[]>([]);
    const [running,     setRunning]     = useState(false);
    const [liveLatency, setLiveLatency] = useState(2.0);
    const [livePktLoss, setLivePktLoss] = useState(0);

    // Compare mode state
    const [compareMode,          setCompareMode]          = useState(false);
    const [cmpCentralLatency,    setCmpCentralLatency]    = useState(2.0);
    const [cmpCentralPktLoss,    setCmpCentralPktLoss]    = useState(0);
    const [cmpEdgeLatency,       setCmpEdgeLatency]       = useState(2.0);
    const [cmpEdgePktLoss,       setCmpEdgePktLoss]       = useState(0);

    // ── Single-mode derived state ─────────────────────────────────────────
    const isEdge        = sandboxArchitecture === 'edge';
    const isOverloaded  = sandboxArchitecture === 'centralized' && sandboxAPs > 30;
    const isIsolated    = sandboxArchitecture === 'centralized' && sandboxFailure !== 'none';
    const isRfCongested = sandboxInterference === 'high';
    const isMloActive   = sandboxStandard === 'wifi7';
    const hasRfFailure  = isRfCongested && !isMloActive;
    const hasAnyFailure = isOverloaded || isIsolated || hasRfFailure;
    const canAnimate    = running && !prefersReducedMotion;
    const scenarioTitle = currentScenario ? SCENARIOS[currentScenario]?.title.split(':')[0] : null;
    const workloadLabel = getWorkloadLabel(currentScenario);

    // ── Compare mode derived state (always centralized vs edge) ──────────
    const cmpCentralOverloaded = sandboxAPs > 30;
    const cmpCentralIsolated   = sandboxFailure !== 'none';
    const cmpRfFail            = isRfCongested && !isMloActive;
    const cmpCentralFail       = cmpCentralOverloaded || cmpCentralIsolated || cmpRfFail;
    const cmpEdgeFail          = cmpRfFail; // edge only fails on RF without MLO

    // ── Syslog generation (single mode) ──────────────────────────────────
    useEffect(() => {
        if (!running) return;
        const iv = setInterval(() => {
            const t = new Date().toISOString().split('T')[1].slice(0, -1);
            let log = `[${t}] INFO: Traffic nominal...`;
            if (isOverloaded)                        log = `[${t}] CRITICAL: WLC_MEM_OVERFLOW. Dropping frames.`;
            else if (isIsolated)                     log = `[${t}] CRITICAL: WLC_UNREACHABLE. Tunnels collapsed.`;
            else if (hasRfFailure)                   log = `[${t}] WARN: 5GHz CO-CHANNEL_INTERFERENCE. Latency: ${200 + Math.floor(Math.random() * 200)}ms`;
            else if (isRfCongested && isMloActive)   log = `[${t}] INFO: MLO ACTIVE. Switching stream to 6GHz. Latency: 2ms`;
            else if (sandboxFailure === 'cloud' && isEdge) log = `[${t}] WARN: CVP unreachable. Edge forwarding active.`;
            setSyslogs(prev => [...prev.slice(-15), log]);
        }, 1000);
        return () => clearInterval(iv);
    }, [running, isOverloaded, isIsolated, sandboxFailure, isEdge, hasRfFailure, isRfCongested, isMloActive]);

    // ── Live metrics (single mode) ────────────────────────────────────────
    useEffect(() => {
        if (!running) { setLiveLatency(2.0); setLivePktLoss(0); return; }
        const iv = setInterval(() => {
            if (hasAnyFailure) {
                setLiveLatency(200 + Math.random() * 250);
                setLivePktLoss(Math.round(10 + Math.random() * 25));
            } else {
                setLiveLatency(1 + Math.random() * 2);
                setLivePktLoss(0);
            }
        }, 600);
        return () => clearInterval(iv);
    }, [running, hasAnyFailure]);

    // ── Compare mode metrics ──────────────────────────────────────────────
    useEffect(() => {
        if (!running || !compareMode) {
            setCmpCentralLatency(2.0);
            setCmpCentralPktLoss(0);
            return;
        }
        const iv = setInterval(() => {
            if (cmpCentralFail) {
                setCmpCentralLatency(200 + Math.random() * 250);
                setCmpCentralPktLoss(Math.round(10 + Math.random() * 25));
            } else {
                setCmpCentralLatency(1 + Math.random() * 2);
                setCmpCentralPktLoss(0);
            }
        }, 600);
        return () => clearInterval(iv);
    }, [running, compareMode, cmpCentralFail]);

    useEffect(() => {
        if (!running || !compareMode) {
            setCmpEdgeLatency(2.0);
            setCmpEdgePktLoss(0);
            return;
        }
        const iv = setInterval(() => {
            if (cmpEdgeFail) {
                setCmpEdgeLatency(200 + Math.random() * 250);
                setCmpEdgePktLoss(Math.round(10 + Math.random() * 25));
            } else {
                setCmpEdgeLatency(1 + Math.random() * 2);
                setCmpEdgePktLoss(0);
            }
        }, 600);
        return () => clearInterval(iv);
    }, [running, compareMode, cmpEdgeFail]);

    // ── Derived display strings (single mode) ────────────────────────────
    const healthState  = hasAnyFailure ? 'Degraded' : 'Nominal';
    const controlState = isEdge ? 'CloudVision management only' : isIsolated ? 'Controller unreachable' : 'Controller carries data and management';
    const dataState    = isEdge ? 'Autonomous edge forwarding' : isIsolated ? 'Centralized data path degraded' : 'Forwarding through centralized dependency';
    const rootCause    = isOverloaded
        ? 'AP count above 30 in centralized mode triggers controller pressure in this illustrative model.'
        : isIsolated
            ? 'Cloud or WAN loss removes the centralized control dependency.'
            : hasRfFailure
                ? 'High RF interference without Wi-Fi 7 MLO removes the alternate path.'
                : isEdge && sandboxFailure !== 'none'
                    ? 'The injected management-side fault is active, but edge forwarding keeps client traffic local.'
                    : isRfCongested && isMloActive
                        ? 'Wi-Fi 7 MLO keeps an alternate 6 GHz path available during congestion.'
                        : 'No active modeled fault is violating service goals.';

    const resetRun = () => {
        setRunning(false);
        setSyslogs([]);
        setLiveLatency(2.0);
        setLivePktLoss(0);
        setCmpCentralLatency(2.0);
        setCmpCentralPktLoss(0);
        setCmpEdgeLatency(2.0);
        setCmpEdgePktLoss(0);
    };

    return (
        <div className="min-h-screen bg-[#050510] text-slate-300 font-sans p-4 sm:p-6 overflow-x-hidden lg:h-screen lg:overflow-hidden flex flex-col pt-24 lg:pt-6">

            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4 border-b border-white/10 pb-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3 text-wrap">
                        <Network size={24} aria-hidden="true" className="text-arista-blue shrink-0" />
                        Architecture Scenario Engine
                        {compareMode && (
                            <span className="rounded border border-arista-purple/40 bg-arista-purple/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-arista-purple">
                                Compare Mode
                            </span>
                        )}
                    </h1>
                    <p className="text-xs font-mono text-slate-500 mt-1">
                        {scenarioTitle ? `Scenario: ${scenarioTitle}` : 'Select a guided scenario or tune the model inputs'}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setRunning(r => !r)}
                        className={`px-4 sm:px-6 py-2 rounded-lg font-mono text-xs shadow-lg flex items-center gap-2 border transition-colors ${focusRing} ${
                            running ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-arista-green/10 border-arista-green/30 text-arista-green hover:bg-arista-green/20'
                        }`}
                    >
                        {running ? <><Square size={14} aria-hidden="true" /> STOP RUN</> : <><Play size={14} aria-hidden="true" /> RUN SCENARIO</>}
                    </button>
                    <button
                        onClick={() => setCompareMode(m => !m)}
                        aria-pressed={compareMode}
                        className={`px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-2 border transition-colors ${focusRing} ${
                            compareMode
                                ? 'bg-arista-purple/15 border-arista-purple/40 text-arista-purple'
                                : 'border-white/10 hover:bg-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Columns2 size={13} aria-hidden="true" />
                        COMPARE
                    </button>
                    <button
                        onClick={resetRun}
                        className={`px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-xs font-mono transition-colors ${focusRing}`}
                    >
                        <span className="inline-flex items-center gap-2"><RotateCcw size={13} aria-hidden="true" /> RESET</span>
                    </button>
                    <button
                        onClick={() => useStore.getState().setActiveView('landing')}
                        className={`px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-xs font-mono transition-colors ${focusRing}`}
                    >
                        [EXIT SANDBOX]
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">

                {/* ── Scenario Selector / Controls ─────────────────────── */}
                <ScenarioSelector />

                {/* ── Main canvas column ───────────────────────────────── */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-4 min-h-0">

                    {compareMode ? (
                        <>
                            {/* ── COMPARE MODE ─────────────────────────── */}

                            {/* Delta strip */}
                            <CompareDeltaStrip
                                running={running}
                                centralLatency={cmpCentralLatency}
                                centralPktLoss={cmpCentralPktLoss}
                                centralHasFailure={cmpCentralFail}
                                edgeLatency={cmpEdgeLatency}
                                edgePktLoss={cmpEdgePktLoss}
                                edgeHasFailure={cmpEdgeFail}
                            />

                            {/* Two topology canvases side-by-side */}
                            <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
                                <TopologyCanvas
                                    isEdge={false}
                                    isOverloaded={cmpCentralOverloaded}
                                    isIsolated={cmpCentralIsolated}
                                    isRfCongested={isRfCongested}
                                    isMloActive={isMloActive}
                                    hasRfFailure={cmpRfFail}
                                    hasAnyFailure={cmpCentralFail}
                                    canAnimate={canAnimate}
                                    running={running}
                                    sandboxAPs={sandboxAPs}
                                    liveLatency={cmpCentralLatency}
                                    livePktLoss={cmpCentralPktLoss}
                                    workloadLabel={workloadLabel}
                                    archLabel="CENTRALIZED"
                                />
                                <TopologyCanvas
                                    isEdge={true}
                                    isOverloaded={false}
                                    isIsolated={false}
                                    isRfCongested={isRfCongested}
                                    isMloActive={isMloActive}
                                    hasRfFailure={cmpEdgeFail}
                                    hasAnyFailure={cmpEdgeFail}
                                    canAnimate={canAnimate}
                                    running={running}
                                    sandboxAPs={sandboxAPs}
                                    liveLatency={cmpEdgeLatency}
                                    livePktLoss={cmpEdgePktLoss}
                                    workloadLabel={workloadLabel}
                                    archLabel="EDGE-NATIVE"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* ── SINGLE MODE ──────────────────────────── */}

                            {/* Live metrics strip */}
                            <div aria-live="polite" className={`grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs border rounded-xl p-3 transition-colors duration-700 ${hasAnyFailure && running ? 'border-arista-red/30 bg-arista-red/5' : 'border-white/5 bg-white/[0.02]'}`}>
                                {[
                                    { label: 'LATENCY',   value: running ? `${liveLatency.toFixed(1)}ms` : '—',     alert: running && liveLatency > 50 },
                                    { label: 'PKT LOSS',  value: running ? `${livePktLoss}%` : '—',                 alert: running && livePktLoss > 0  },
                                    { label: 'UPLINKS',   value: isIsolated ? '0 / 2' : '2 / 2',                    alert: isIsolated },
                                    { label: 'ARCH MODE', value: isEdge ? 'EDGE-NATIVE' : 'CENTRALIZED',             alert: false },
                                ].map(m => (
                                    <div key={m.label} className="flex flex-col gap-0.5">
                                        <span className="text-[9px] text-slate-600 uppercase tracking-widest">{m.label}</span>
                                        <span className={`text-sm font-bold ${m.alert ? 'text-arista-red' : 'text-white'}`}>{m.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid gap-4 xl:grid-cols-[1fr_1.25fr]">
                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">Current State</h2>
                                        <span className={`rounded border px-2 py-1 font-mono text-[10px] uppercase ${
                                            hasAnyFailure ? 'border-arista-red/30 bg-arista-red/10 text-arista-red' : 'border-arista-green/30 bg-arista-green/10 text-arista-green'
                                        }`}>
                                            {healthState}
                                        </span>
                                    </div>
                                    <dl className="grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                                        <div>
                                            <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-600">Control Plane</dt>
                                            <dd className="text-slate-300">{controlState}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-600">Data Plane</dt>
                                            <dd className="text-slate-300">{dataState}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-600">Model Assumption</dt>
                                            <dd className="text-slate-300">{rootCause}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                    <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-300">Topology Legend</h2>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <LegendItem color="#10b981" lineClass="rounded-full" label="Healthy data plane" />
                                        <LegendItem color="#a855f7" lineClass="border-t border-dashed bg-transparent" label="Management/control" />
                                        <LegendItem color="#3b82f6" lineClass="border-t border-dashed bg-transparent" label="RF link" />
                                        <LegendItem color="#9333ea" lineClass="border-t border-dotted bg-transparent" label="Wi-Fi 7 MLO path" />
                                        <LegendItem color="#ef4444" lineClass="border-t border-dashed bg-transparent" label="Degraded/failure" />
                                        <LegendItem color="#64748b" lineClass="rounded-full" label="Inactive path" />
                                    </div>
                                </div>
                            </div>

                            {/* Scenario Feedback */}
                            {currentScenario && (
                                <ScenarioFeedback running={running} liveLatency={liveLatency} livePktLoss={livePktLoss} />
                            )}

                            {/* Single topology canvas */}
                            <TopologyCanvas
                                isEdge={isEdge}
                                isOverloaded={isOverloaded}
                                isIsolated={isIsolated}
                                isRfCongested={isRfCongested}
                                isMloActive={isMloActive}
                                hasRfFailure={hasRfFailure}
                                hasAnyFailure={hasAnyFailure}
                                canAnimate={canAnimate}
                                running={running}
                                sandboxAPs={sandboxAPs}
                                liveLatency={liveLatency}
                                livePktLoss={livePktLoss}
                                workloadLabel={workloadLabel}
                            />
                        </>
                    )}

                    {/* Syslog terminal — shown in both modes */}
                    <TerminalOutput
                        logs={running ? syslogs : []}
                        emptyMessage="No events. Click [RUN SCENARIO] to begin."
                        height="h-36 lg:h-40"
                    />
                </div>
            </div>
        </div>
    );
};
