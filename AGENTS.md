# NextGenWireless — Arista Wireless Differentiators App

## Project Overview

A React SPA that sells Arista's wireless edge-native architecture to two audiences simultaneously: **executives** (business impact framing) and **architects** (technical depth). The app has a landing page with interactive sections and a guided Architecture Scenario Engine for testing real-world deployments.

## Stack

| Tool | Version | Notes |
|------|---------|-------|
| React | 19 | No class components |
| TypeScript | 5.8 | Strict mode |
| Vite | 6 | `npm run dev` → port 3000 |
| Tailwind CSS | v4 | Config is in `index.css` via `@theme` — **no `tailwind.config.js`** |
| Zustand | 5 | Single store in `store.ts` |
| Framer Motion | 12 | Animations in landing sections |
| Lucide React | latest | Icons |

## Commands

```bash
npm run dev       # Dev server → localhost:3000
npm run build     # Production build
npm run lint      # tsc --noEmit (type check only, no eslint)
```

## Directory Structure

```
/
├── App.tsx                      # Root: toggles between LandingPage and ArchitectureSandbox
├── store.ts                     # All global state (Zustand)
├── index.css                    # Tailwind v4 @theme tokens + .glass-card utility
├── index.html / index.tsx       # Entry
├── components/
│   ├── landing/                 # All landing page sections
│   │   ├── LandingPage.tsx      # Section assembly (renders all sections in order)
│   │   ├── Hero.tsx             # Opening SVG animation (glow filters, SMIL packets)
│   │   ├── Manifesto.tsx        # Core philosophy, animated dashboard card
│   │   ├── ArchitecturalParadox.tsx
│   │   ├── FiveBehaviors.tsx
│   │   ├── ZTP.tsx              # Zero Touch Provisioning demo
│   │   ├── FailureResilience.tsx
│   │   ├── CompetitiveGrid.tsx  # 4-col comparison table
│   │   ├── Wifi7Physics.tsx
│   │   ├── SecurityEdge.tsx
│   │   ├── SupportAdvantage.tsx
│   │   ├── AristaDifference.tsx
│   │   ├── ROICalculator.tsx
│   │   └── Misconceptions.tsx
│   ├── sandbox/
│   │   ├── SandboxWorkspace.tsx     # Architecture Scenario Engine (SVG topology canvas + guided scenarios)
│   │   ├── ScenarioSelector.tsx    # Scenario selection and detail view
│   │   └── ScenarioFeedback.tsx    # Real-time goal feedback during simulation
│   └── ui/
│       ├── GlassCard.tsx        # Glassmorphism wrapper — USE THIS for card containers
│       ├── TerminalOutput.tsx   # Styled syslog terminal — USE THIS for log displays
│       ├── SandboxRelay.tsx     # Button that deep-links into sandbox with pre-seeded config
│       ├── Section.tsx          # Standard section wrapper with title/subtitle
│       ├── Background.tsx       # Animated starfield background
│       ├── AttributionTag.tsx   # "Source: Arista" attribution badge
│       └── Jargon.tsx           # Inline tooltip for technical terms
```

## Design System

### Color Tokens (Tailwind v4 — defined in `index.css` `@theme`)

| Token | Hex | Use |
|-------|-----|-----|
| `arista-bg` | `#04060d` | Page background |
| `arista-card` | `#0a0d14` | Card backgrounds |
| `arista-border` | `#1e293b` | Borders, dividers |
| `arista-blue` | `#4f46e5` | Primary CTA, active states, Arista brand |
| `arista-purple` | `#9333ea` | Wi-Fi 7 / MLO features |
| `arista-green` | `#16a34a` | Success, edge-native mode |
| `arista-amber` | `#d97706` | Warnings |
| `arista-red` | `#dc2626` | Errors, failure states |

### Typography

- Body: `font-sans` (Inter)
- Headings/labels: `font-heading` (Outfit)
- Monospace/terminal: `font-mono`

### Glassmorphism Pattern

Use `<GlassCard>` for card containers. The `.glass-card` CSS class still exists for non-component usage.

```tsx
<GlassCard padding="p-6" intensity="medium" className="additional-classes">
  {children}
</GlassCard>
```

- `intensity`: `'light'` | `'medium'` | `'heavy'` — controls bg opacity
- `padding`: any Tailwind padding string (default `p-6`); pass `""` to suppress

## UI Primitives

### GlassCard

```tsx
import { GlassCard } from '../ui/GlassCard';
<GlassCard padding="p-6" intensity="medium" className="rounded-2xl">...</GlassCard>
```

### TerminalOutput

```tsx
import { TerminalOutput } from '../ui/TerminalOutput';
<TerminalOutput logs={running ? syslogs : []} emptyMessage="No events." />
```

- `logs: string[]` — auto-colors: `CRITICAL` → red, `WARN` → amber, else slate
- `filename` (default `/var/log/syslog`), `height` (default `h-48`)
- **Do not use** for log arrays of `{time, msg}` objects — those need AnimatePresence (see ZTP.tsx)

### SandboxRelay

```tsx
import { SandboxRelay } from '../ui/SandboxRelay';
<SandboxRelay config={{ sandboxArchitecture: 'edge', sandboxFailure: 'cloud' }} variant="purple">
  [Simulate in Sandbox]
</SandboxRelay>
```

- Calls `setSandboxConfig(config)` + `setActiveView('sandbox')` on click
- `variant`: `'primary'` (blue) | `'secondary'` (neutral) | `'purple'`
- `config` keys must match Zustand store fields (see `store.ts`)

### Section

```tsx
import { Section } from '../ui/Section';
<Section id="my-section" title="Title" subtitle="Subtitle">{children}</Section>
```

## State Management (`store.ts`)

Key state slices:

```ts
mode: 'executive' | 'architect'           // Audience toggle (affects all section copy)
activeView: 'landing' | 'sandbox'         // Top-level view
sandboxArchitecture: 'centralized' | 'edge'
sandboxFailure: 'none' | 'cloud' | 'wan' | 'controller'
sandboxStandard: 'wifi6' | 'wifi7'
sandboxInterference: 'low' | 'high'
sandboxAPs: number                        // 5–150
```

Access outside React: `useStore.getState().someAction()`

## Dual-Audience Pattern

Every section checks `mode` from the store and renders different copy:

```tsx
const { mode } = useStore();
// ...
<span>{mode === 'executive' ? 'Business framing' : 'Technical framing'}</span>
```

## SVG Animation Patterns

The sandbox and Hero use SMIL `animateMotion` for flowing packets — not Framer Motion:

```tsx
<circle r="3" fill="#3b82f6" filter="url(#sb-blue)">
  <animateMotion dur="2s" repeatCount="indefinite" path="M 0 0 L 100 100" />
</circle>
```

SVG glow filters are defined in `<defs>` with `feGaussianBlur + feMerge`.

## Preview / Dev Server

Config: `.Codex/launch.json`

- Dev: port 3000 — `preview_start("dev")`
- Preview: port 4173 — `preview_start("preview")`

**Note:** The Codex Preview tool browser cannot connect to localhost in this environment. Use `tsc --noEmit` (`npm run lint`) to verify type correctness instead.

## Conventions

- No test files exist — use `npm run lint` (tsc) for correctness verification
- No ESLint config — don't add one unless asked
- Tailwind v4: no arbitrary value syntax issues, use `bg-arista-blue/10` opacity syntax
- All imports use relative paths (no `@/` alias for components — only root-level files use `@/`)
- `const` arrow functions for all components (no `function` declarations)
- Keep SVG animations in SMIL (`animateMotion`) not CSS for path-following motion

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT:** This project has a local `code-review-graph` knowledge graph.
Use graph tools before broad file scans when orienting on architecture,
hotspots, or impact. Fall back to `rg` and direct source reads when exact
source context is required or when the graph under-models a symbol.

### When to use graph tools FIRST

- **Architecture questions**: `get_architecture_overview`
- **Finding hotspots**: `get_hub_nodes`
- **Finding chokepoints**: `get_bridge_nodes`
- **Finding weak spots**: `get_knowledge_gaps`
- **Exploring code**: `semantic_search_nodes`
- **Understanding impact**: `get_affected_flows`

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `get_affected_flows` | Finding which execution paths are impacted |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `get_hub_nodes` | Finding high-degree nodes with larger blast radius |
| `get_bridge_nodes` | Finding bridge nodes between code regions |
| `get_knowledge_gaps` | Finding isolated nodes and untested hotspots |

### Workflow

1. Build or refresh locally with `code-review-graph build --repo .`.
2. Use graph tools for orientation and impact analysis.
3. Use `rg` and direct reads for exact implementation details.
4. Check `docs/KNOWLEDGE_GRAPH.md` for known parser caveats around `store.ts`, `constants.ts`, and scenario definitions.
