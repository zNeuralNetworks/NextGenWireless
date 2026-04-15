# Architecture Scenario Engine UI Assessment & Roadmap

Date: 2026-04-15

## Scope

Review target: Architecture Scenario Engine in `components/sandbox/`.

Primary files:

- `components/sandbox/SandboxWorkspace.tsx`
- `components/sandbox/ScenarioSelector.tsx`
- `components/sandbox/ScenarioFeedback.tsx`
- `components/ui/TerminalOutput.tsx`
- `constants/scenarios.ts`

Verification artifacts captured locally:

- `/tmp/nextgenwireless-ui-audit/sandbox-desktop.png`
- `/tmp/nextgenwireless-ui-audit/sandbox-mobile.png`
- `/tmp/nextgenwireless-ui-audit/sandbox-desktop-campus-running.png`

Review basis:

- Rendered desktop and mobile UI at `http://127.0.0.1:3000/`
- Current Vercel Web Interface Guidelines
- Existing strategic direction in `STRATEGIC_REVIEW.md`

## Executive Grade

Overall grade: **B-**

The engine has a credible visual core: a dark NOC-style workspace, a real topology canvas, live metric feedback, animated packet flows, and scenario framing. It feels more like an engineering tool than a marketing panel, which is the right direction.

The current limitation is that the UI implies a simulator but behaves closer to a guided animation. Users can pick a scenario and run stress, but they cannot meaningfully model their own architecture, compare outcomes side-by-side, inspect causes, export results, or understand every visual state without already knowing the code's assumptions. Mobile also breaks the experience because the fixed desktop layout clips horizontally.

## Implementation Progress

Last updated: 2026-04-15

Completed in first implementation pass:

- P0/P1 shell improvements:
  - Reworked sandbox layout to avoid document-level horizontal clipping on mobile.
  - Added responsive header controls and renamed the primary action to "Run Scenario."
  - Added visible model inputs for architecture, AP count, Wi-Fi standard, RF interference, and failure injection.
  - Added "Apply Scenario Defaults" and "Reset" actions.
  - Added visible focus states for engine controls.
  - Added live regions for metrics, goal feedback, and terminal output.
  - Added accessible title/description on the topology SVG.
  - Added reduced-motion gating for animated topology particles and pulse rings.
- Visual grammar improvements:
  - Replaced the terminal title icon with a network-oriented icon.
  - Replaced the scenario emoji with Lucide icons.
  - Replaced close-style back affordance with an arrow.
  - Added a persistent topology legend.
  - Added a current-state panel with control-plane, data-plane, and model-assumption text.
  - Made workload labels scenario-specific instead of always showing "Warehouse Robotics."
- Runtime cleanup:
  - Removed external `grainy-gradients.vercel.app/noise.svg` decorative dependencies from active UI paths.
  - Verified no browser console errors, no Vite overlay, and no 4xx resources in the Scenario Engine flow.

Still open:

- P1 compare mode is not implemented yet.
- P2 node inspectors are not implemented yet.
- P3 structured scoring model is not implemented yet.
- P4 export/share artifacts are not implemented yet.
- P5 benchmark-platform expansion is not implemented yet.

Current verification artifacts:

- `/tmp/nextgenwireless-ui-roadmap-final/sandbox-desktop.png`
- `/tmp/nextgenwireless-ui-roadmap-final/sandbox-mobile.png`

## Scorecard

| Area | Grade | Assessment |
| --- | --- | --- |
| Visual concept | **B+** | Strong topology metaphor, good dark-control-room mood, clear central canvas hierarchy on desktop. |
| Iconography | **C+** | Lucide icons are clean, but the system mixes generic UI icons, emoji, text glyphs, and custom SVG device symbols without a unified legend. |
| Scenario UX | **B-** | Scenarios are realistic and useful, but selection does not yet become a true decision workflow. |
| Simulation clarity | **C+** | Metrics and animation react, but root-cause logic is hidden and users must infer why outcomes happen. |
| Mobile/responsive | **D** | Header controls and fixed dashboard layout overflow/clamp; the canvas is not usable as a mobile tool. |
| Accessibility | **C-** | Buttons have text, but the SVG has no accessible summary, dynamic metrics/logs lack live regions, focus states are weak, and motion has no reduced-motion path. |
| Engineering maintainability | **C+** | The core is functional, but the large monolithic SVG component mixes state derivation, simulation logic, rendering, labels, and visual tokens. |
| Strategic fit | **B** | Matches the strategic recommendation to become a repeatable benchmark tool, but it needs configurability, comparison, and export paths. |

## Current Strengths

1. **Topology-first composition**
   The main canvas uses a recognizable control-plane/data-plane layout: controller/cloud at top, AP groups in the middle, client workload at bottom, and a data-plane foundation bar. This is the right mental model for explaining centralized control-plane dependency versus edge autonomy.

2. **Scenario library is grounded**
   The five scenarios cover credible enterprise wireless pressure points: campus density, branch WAN resilience, dense venue RF congestion, regional blast radius, and high-rise roaming. These are suitable field-enablement examples.

3. **Live metrics create useful tension**
   Latency, packet loss, uplinks, and architecture mode give the user immediate operational feedback. This is more persuasive than static copy.

4. **Animated packet flows support the concept**
   SMIL packet motion makes data/control flow visible without bringing in a heavy rendering engine.

5. **The state model is already close**
   Zustand already has the knobs needed for a real scenario engine: architecture, AP count, Wi-Fi standard, interference, failure mode, and current scenario.

## Major Issues

### 1. Mobile layout is not viable

Evidence:

- `SandboxWorkspace.tsx` uses a full-screen grid and `overflow-hidden` on the root container.
- Header controls remain horizontal on small screens.
- The desktop SVG canvas is not adapted into a scrollable, zoomable, or stacked mobile presentation.

Impact:

- On a 390 px viewport, the engine title wraps awkwardly, the run/exit controls push off-screen, and the canvas is below a tall scenario list. This is a tablet/laptop-only tool today.

### 2. The subtitle promises free-form modeling, but the UI does not expose controls

Evidence:

- Header copy says "Select a guided scenario or model your own."
- `ScenarioSelector.tsx` only offers scenario selection and an exit button.
- `setSandboxConfig` exists, but there are no visible controls for AP count, architecture, standard, interference, or failure mode in the engine.

Impact:

- The engine cannot yet be used as a repeatable architecture benchmark. It is still mostly a guided demo.

### 3. Icon system lacks a shared language

Evidence:

- Header uses `Terminal` for the whole engine.
- Scenario list uses `BookOpen`, `ChevronRight`, and an emoji chart glyph.
- Feedback uses `CheckCircle` / `AlertTriangle` plus text glyphs `✓` and `✗`.
- Topology nodes are custom SVG shapes with text labels.
- Several Lucide imports are unused in `SandboxWorkspace.tsx` and `ScenarioSelector.tsx`.

Impact:

- Icons look individually fine, but they do not teach the engine's visual grammar. Users need a legend for controller/cloud, AP group, client workload, management plane, data plane, MLO path, degraded path, and failed path.

### 4. Color carries too much semantic weight

Evidence:

- Green means success, edge mode, and forwarding.
- Purple means CloudVision/management and MLO/Wi-Fi 7 in different places.
- Blue means centralized mode, RF path, and primary brand.
- Red means overload, RF failure, failed goals, and unreachable control.

Impact:

- The color logic is understandable after inspection, but not self-evident. Color-blind users and first-time users need labels, patterns, and a legend.

### 5. Simulation logic is hidden and over-simplified

Evidence:

- `hasAnyFailure` is derived from only overload, cloud isolation, and RF congestion without Wi-Fi 7.
- A centralized deployment with more than 30 APs is always overloaded.
- Scenario goals parse strings with `parseInt`, so `<10ms` becomes `10` and `0%` becomes `0`.
- Several goals are displayed but not evaluated, such as Controller CPU, uptime, MTTR, and coverage consistency.

Impact:

- The UI can teach the wrong mental model if users treat the numbers as realistic simulation output. It needs explicit model assumptions and per-scenario scoring logic.

### 6. Accessibility and motion need a pass

Evidence:

- The main topology SVG has no title/description or textual equivalent.
- Dynamic metric and terminal updates are not exposed via `aria-live`.
- Repeated `transition-all` and SVG animations do not honor reduced-motion preferences.
- Focus-visible states are not consistently defined for buttons.

Impact:

- Keyboard and assistive-tech users can operate basic buttons but cannot understand the core simulation. Motion-sensitive users have no reduced variant.

### 7. The engine has no output artifact

Impact:

- A field engineer cannot leave a customer with a scenario snapshot, comparison PDF, or architecture summary. This limits sales and enablement value.

## Iconography Assessment

Current icon grade: **C+**

What works:

- Lucide React is visually consistent and lightweight.
- `Play` / `Pause` are immediately understandable for simulation control.
- `CheckCircle` / `AlertTriangle` are appropriate for pass/fail feedback.
- Custom SVG nodes make the topology feel purpose-built rather than generic.

What does not work:

- `Terminal` as the primary title icon frames the engine as CLI/logging rather than architecture modeling.
- `BookOpen` suggests documentation, while the panel is actually a scenario launcher.
- The emoji chart glyph breaks the Lucide/custom-SVG visual system.
- `X` for "Back to scenarios" reads like close/dismiss, not navigation.
- The AP icon, WLC icon, CloudVision label, client hexagon, MLO badge, packet dots, and path styles have no visible legend.

Recommended icon language:

| Concept | Icon / visual treatment |
| --- | --- |
| Engine title | `Network`, `Route`, or `Workflow` instead of `Terminal` |
| Scenario launcher | `ListChecks` or `Map` instead of `BookOpen` |
| Back to scenarios | `ArrowLeft` instead of `X` |
| Run stress test | `PlayCircle` with explicit "Run Scenario" copy |
| Stop simulation | `Square` or `PauseCircle`; use "Stop Run" |
| Centralized architecture | Controller/rack glyph with single-dependency badge |
| Edge-native architecture | AP cluster glyph with distributed-state badge |
| Management plane | Purple dashed line + "Mgmt" legend token |
| Data plane | Green/blue solid line + "Data" legend token |
| Degraded/failure path | Red dashed line + warning marker, not only red color |
| Wi-Fi 7 MLO | Dual-band path badge with "5 GHz / 6 GHz" labels |

## Roadmap

### P0: Make the Current Engine Trustworthy

Goal: remove UI breakage and obvious accessibility gaps without changing the product model.

Tasks:

- Fix mobile overflow:
  - Change the sandbox root from `overflow-hidden` to a responsive scroll strategy.
  - Stack header controls under the title on small screens.
  - Put scenario list and canvas into independently scrollable regions only at desktop breakpoints.
  - Add a mobile canvas mode: either horizontal pan with visible affordance or simplified stacked topology.
- Add visible focus states:
  - Add `focus-visible:ring-2 focus-visible:ring-arista-blue` to all engine buttons.
  - Replace `transition-all` with explicit transitions for `background-color`, `border-color`, `color`, `opacity`, and `transform`.
- Add accessible simulation summaries:
  - Add `<title>` and `<desc>` inside the main SVG.
  - Add a text "Current State" panel that summarizes architecture, failure mode, latency, packet loss, and root cause.
  - Add `aria-live="polite"` to metric updates and terminal output.
- Honor reduced motion:
  - Use `useReducedMotion` from Framer Motion or CSS `@media (prefers-reduced-motion: reduce)`.
  - Disable packet animation and pulse rings in reduced-motion mode; show static directional arrows instead.
- Clean up imports:
  - Remove unused Lucide imports from `SandboxWorkspace.tsx` and `ScenarioSelector.tsx`.
  - Remove unused `AnimatePresence` and `GlassCard` imports from `ScenarioSelector.tsx`.
- Replace non-system glyphs:
  - Replace emoji chart in `ScenarioSelector.tsx` with a Lucide icon.
  - Replace `✓` / `✗` text glyphs with consistent icon+text or plain text.
- Investigate the runtime `403` console resource:
  - Capture network request URL.
  - Remove or self-host the asset if it is decorative.

Acceptance criteria:

- `npm run lint` passes.
- `npm run build` passes.
- Desktop screenshot shows no regressions.
- Mobile screenshot at 390 x 844 shows title, controls, scenario list, and a usable route to the canvas without horizontal clipping.
- Browser check shows no Vite overlay and no unexplained console errors.

### P1: Convert Demo Into a Scenario Workflow

Goal: make the engine teach through user decisions rather than passive animation.

Tasks:

- Rename primary action from "Run Stress Test" to "Run Scenario."
- Add a scenario objective header:
  - "Goal"
  - "Constraints"
  - "Architecture under test"
  - "Expected user impact"
- Add visible controls for the existing state model:
  - Architecture: Centralized / Edge-Native toggle
  - AP count
  - Wi-Fi standard: Wi-Fi 6 / Wi-Fi 7
  - Interference: Low / High
  - Failure: None / Cloud / WAN / Controller
- Add "Apply Scenario Defaults" and "Reset Run" actions.
- Add architecture comparison mode:
  - Single-view mode: current architecture only.
  - Compare mode: Centralized and Edge-Native results side-by-side.
- Add root-cause explanation after each run:
  - Trigger
  - Control-plane impact
  - Data-plane impact
  - User impact
  - Why the alternate architecture behaves differently
- Add scenario progress:
  - Step 1: Select scenario
  - Step 2: Choose architecture
  - Step 3: Inject constraint
  - Step 4: Run
  - Step 5: Review result

Acceptance criteria:

- A first-time user can complete one scenario without reading source code.
- Every scenario has at least one meaningful decision point.
- The result panel clearly states whether goals were met and why.

### P2: Rebuild the Visual System Around a Legend

Goal: make the topology self-explanatory and defensible in front of customers.

Tasks:

- Add a persistent legend below or beside the canvas:
  - Management plane
  - Data plane
  - RF link
  - MLO path
  - State sync
  - Degraded path
  - Failed dependency
- Standardize semantic colors:
  - Blue: selected/current path or brand action
  - Green: healthy data-plane forwarding
  - Purple: management/control-plane only
  - Amber: degraded warning
  - Red: failed or violated objective
- Add pattern semantics independent of color:
  - Solid: forwarding/data
  - Dashed: management/control
  - Dotted: telemetry
  - Broken dash: degraded/failing
- Replace topology labels with clearer terms:
  - "CloudVision / Mgmt Plane" when edge-native
  - "Controller / Control + Data Dependency" when centralized
  - "AP Cluster A/B" instead of "AP Group A/B"
  - Client workload should be scenario-specific, not always "Warehouse Robotics."
- Add hover/click inspectors for each topology node:
  - Role
  - Current state
  - Failure domain
  - Relevant metric

Acceptance criteria:

- A screenshot alone communicates what each color, line, and node means.
- Scenario-specific client/workload labels match the selected scenario.

### P3: Make Simulation Outputs Credible

Goal: make the scoring model transparent and scenario-specific.

Tasks:

- Move simulation model logic out of `SandboxWorkspace.tsx` into a dedicated module:
  - `components/sandbox/simulation/model.ts`
  - `components/sandbox/simulation/scoring.ts`
  - `components/sandbox/simulation/types.ts`
- Define explicit scenario metrics:
  - Latency
  - Packet loss
  - Availability
  - Blast radius
  - Controller/control-plane headroom
  - Recovery time
- Stop parsing goal strings with `parseInt`.
  - Store goals as structured operators: `{ metric, operator: '<=', value: 10, unit: 'ms' }`.
- Add deterministic seeded runs:
  - Same inputs produce the same baseline result.
  - Optional "jitter" mode can add variability for live demos.
- Add assumption labels:
  - "Illustrative model"
  - "Assumes centralized control-plane dependency"
  - "Assumes edge forwarding persists during cloud management loss"
- Add per-scenario state diagrams:
  - What fails
  - What keeps forwarding
  - What recovers

Acceptance criteria:

- Every displayed goal is evaluated.
- Every failure result maps to an explicit input and scenario assumption.
- Results are stable enough to use in a customer-facing demo.

### P4: Add Export & Field-Enablement Artifacts

Goal: make the engine useful after the live demo ends.

Tasks:

- Add "Export Scenario Summary":
  - Selected scenario
  - Inputs
  - Architecture comparison
  - Goal result table
  - Topology snapshot
  - Recommended next discussion points
- Add "Copy Architecture Summary" for paste into email/Slack.
- Add "Download PNG" for the topology canvas.
- Add "Generate Briefing PDF" once the model is stable.
- Add shareable URL state:
  - Scenario ID
  - Architecture
  - AP count
  - Standard
  - Failure mode
  - Interference

Acceptance criteria:

- A systems engineer can run a scenario and leave behind a clean artifact.
- A shared URL reproduces the same scenario state.

### P5: Turn It Into a Benchmarking Tool

Goal: align with the strongest strategic path in `STRATEGIC_REVIEW.md`: a repeatable competitive benchmark platform.

Tasks:

- Add architecture templates:
  - Centralized controller
  - Cloud-managed with local forwarding
  - Edge-native distributed control
  - Hybrid controller/cloud
- Add competitor-neutral comparison labels first; only add named vendors if claims are sourced and supportable.
- Add deployment configurator:
  - Sites
  - APs per site
  - User density
  - Critical applications
  - WAN dependency
  - RF complexity
- Add risk scoring:
  - Control-plane concentration
  - WAN/cloud dependency
  - Blast radius
  - Operational recovery burden
- Add recommended next action:
  - "Review branch resilience"
  - "Model dense venue MLO"
  - "Export comparison"

Acceptance criteria:

- The engine can model a user's network instead of only prebuilt examples.
- The output reads like a decision aid, not a sales animation.

## Suggested Implementation Order

1. **P0 responsive/accessibility cleanup**
2. **P1 visible scenario controls**
3. **P2 legend and icon language**
4. **P3 extracted scoring model**
5. **P4 export/share**
6. **P5 benchmarking expansion**

This order minimizes rework: stabilize the shell, expose the existing state, make the visual grammar understandable, then harden the model and add export/benchmarking value.

## File-Level Notes

`components/sandbox/SandboxWorkspace.tsx`

- Split into smaller units:
  - `SandboxHeader`
  - `LiveMetricsStrip`
  - `TopologyCanvas`
  - `TopologyLegend`
  - `SimulationTerminal`
- Move constants and paths into `topology/constants.ts`.
- Move derived status booleans into a model helper.
- Add reduced-motion support around SMIL animations.

`components/sandbox/ScenarioSelector.tsx`

- Replace scenario cards with a clearer launcher + active detail panel.
- Use `ArrowLeft` for back navigation.
- Remove unused imports.
- Add focus-visible states.
- Consider a compact mobile scenario picker.

`components/sandbox/ScenarioFeedback.tsx`

- Convert goal evaluation to structured scoring.
- Add root-cause and recommended-action blocks.
- Use a single success/failure icon treatment rather than icon plus glyph duplication.

`components/ui/TerminalOutput.tsx`

- Add `aria-live="polite"`.
- Add a "Copy Logs" action if logs become useful artifacts.
- Consider constraining terminal height differently on mobile.

`constants/scenarios.ts`

- Convert free-form goals to structured metric definitions.
- Add scenario-specific client/workload labels.
- Add scenario-specific failure assumptions.
- Add recommended architecture and expected comparison deltas.

## Done Definition

The Architecture Scenario Engine is "roadmap complete" when:

- It works on laptop, tablet, and mobile without clipping.
- It exposes all meaningful model inputs in the UI.
- It explains not only what happened, but why it happened.
- It can compare at least Centralized vs Edge-Native for every scenario.
- It provides an exportable/shareable artifact.
- It has an accessible non-animated path for the core simulation.
