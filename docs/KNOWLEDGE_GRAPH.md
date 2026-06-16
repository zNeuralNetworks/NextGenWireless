# Knowledge Graph Workflow

This repo is configured for `code-review-graph` through the portable MCP config in `.mcp.json`.

## Local Setup

Install or run the graph tool with `uvx`:

```bash
uvx code-review-graph --help
```

Build or refresh the local graph database:

```bash
code-review-graph build --repo .
code-review-graph postprocess --repo .
code-review-graph status --repo .
```

The generated database lives under `.code-review-graph/` and is intentionally ignored by Git.

## Agent Usage

Use the graph before broad file scans when orienting on the codebase:

- Architecture overview: `get_architecture_overview`
- Hotspots: `get_hub_nodes`
- Chokepoints: `get_bridge_nodes`
- Gaps: `get_knowledge_gaps`
- Search: `semantic_search_nodes`
- Impact: `get_affected_flows`

Fall back to `rg` and direct source reads when the graph does not model the symbol or when exact source context is required.

## Current Caveats

The TypeScript parser may under-model exported constants and Zustand store symbols. If graph output looks incomplete around `store.ts`, `constants.ts`, or scenario definitions, verify directly from source.

Key files that often need direct confirmation:

- `store.ts`
- `constants.ts`
- `constants/scenarios.ts`
- `components/sandbox/SandboxWorkspace.tsx`
- `components/sandbox/ScenarioSelector.tsx`
- `components/sandbox/ScenarioFeedback.tsx`
