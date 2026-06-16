# NextGenWireless: Architectural Reference Layer

## 🎯 North Star
To transform the standard vendor-brochure experience into a high-status, objective, and authoritative **Systems Engineering Intelligence Layer**. The application serves to validate Arista Networks' architectural superiority not through hyperbolic marketing, but through interactive, rigorous engineering simulations and deterministic systems theory.

## 🥅 Goals
1. **Elevate the Narrative**: Strip away generic marketing jargon (e.g., "flawless", "magic") and replace it with precise technical terminology ("Direct Data-Plane Forwarding", "Deterministic State Changes").
2. **Progressive Disclosure**: Utilize interactive UIs (Accordions, Glassmorphism Cards, Dynamic SVGs) to present massive amounts of technical data without overwhelming the user.
3. **Persona-Driven Insight**: Maintain a dual-track narrative via global state. Serve high-level risk/ROI logic to Executives while providing uncompromised packet-level reality to Architects.
4. **Show, Don't Tell**: Implement rigorous UI simulations (Zero-Touch Provisioning rollouts, Chaos Engineering/Failure injects) so users can *feel* the resiliency of the architecture firsthand.

## 👥 Target Audience
1. **Technical Sellers & Systems Engineers (Partners/Internal)**: To use as a high-fidelity field-enablement tool during customer engagements, deployed natively on laptops and tablets.
2. **Network Architects & Engineers (Customers)**: The inherently skeptical technical evaluators who demand to see the underlying "physics" of the structural protocols before recommending a purchase.
3. **IT Executives & CIOs (Customers)**: Decision-makers focused on risk mitigation, operational scale, lifecycle predictability, and TCO.

## 🏗 Technology Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Custom engineered `.glass-card` styling & `Outfit`/`Inter` premium typography)
- **Animation**: Framer Motion (Simulation engines, SVG flow visualizers, Micro-interactions)
- **State Management**: Zustand (Global mode toggling: `Executive` vs `Architect`)
- **Icons**: Lucide React

## 🚀 Getting Started

**Prerequisites**: Node.js (v18+)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

The application will launch on `http://localhost:3000/`.

## 🧭 Knowledge Graph

This repository supports local code navigation through `code-review-graph`.

```bash
code-review-graph build --repo .
code-review-graph status --repo .
```

The generated `.code-review-graph/` database is local-only and ignored by Git. See `docs/KNOWLEDGE_GRAPH.md` for the MCP workflow, refresh commands, and current parser caveats.

## ☁️ GCP Cloud Build Deployment

`cloudbuild.yaml` builds the Docker image from this GitHub repo, pushes it to Artifact Registry, and deploys it to Cloud Run. The Cloud Run service is public at the edge, but the Node runtime redirects every app route to Google OAuth before serving the Vite build.

Required Secret Manager secrets:

```bash
gcloud secrets create nextgenwireless-google-client-id --replication-policy=automatic
gcloud secrets create nextgenwireless-google-client-secret --replication-policy=automatic
gcloud secrets create nextgenwireless-session-secret --replication-policy=automatic
```

Add secret versions with the OAuth client ID, OAuth client secret, and a high-entropy session secret. Grant the Cloud Build service account Cloud Run deployment permissions, and grant the Cloud Run runtime service account Secret Manager Secret Accessor on those secrets. In Google Cloud Console, connect the GitHub repository `zNeuralNetworks/NextGenWireless` to a Cloud Build trigger that uses `cloudbuild.yaml`.

Google OAuth redirect URI:

```text
https://<cloud-run-service-url>/auth/google/callback
```

Allowed admin accounts are configured in `cloudbuild.yaml`:

```text
tinurajan1@gmail.com,theorajan1@gmail.com
```

## 📁 Core Components & Information Architecture

*   **`Hero.tsx`**: Dynamic animated packet-flow validations contrasting Legacy controller models vs System-Native distributed models.
*   **`Manifesto.tsx`**: The 4 Fundamental Pillars of the architecture, refactored into a high-density interactive Accordion alongside the CV-CUE Management plane.
*   **`CompetitiveGrid.tsx`**: A rigorous, scrollable architectural matrix isolating specific topological weaknesses of controller-centric and cloud-managed competitors.
*   **`ZTP.tsx` & `FailureResilience.tsx` (In-Progress)**: The functional UI simulations proving Zero-Touch scale and data-plane autonomy during simulated catastrophic outages.

## Product Roadmaps

*   **`docs/SCENARIO_ENGINE_UI_ROADMAP.md`**: Current UI/icon assessment, grading, and phased roadmap for turning the Architecture Scenario Engine into a repeatable benchmarking workflow.
*   **`docs/KNOWLEDGE_GRAPH.md`**: Local knowledge-graph setup and usage notes for agent-assisted code navigation.
