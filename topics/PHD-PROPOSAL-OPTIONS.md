# PhD proposal directions (pick 1 to confirm)

Four **distinct** directions grounded in your ingested corpus (world models, JEPA, meta-memory, agents). Each passes your “real problem → existing knowledge → cannot solve” test—not “nobody studied X.”

**How to use:** Read scorecards, pick **one** (or rank top 2). Reply with e.g. `Topic 2` and we scaffold `topics/<name>/`, deepen lit review, and draft proposal sections.

---

## Topic 1 — Composing JEPA world models with test-time meta-memory

**One-line:** Build and evaluate an agent loop where **predictive latents (JEPA/V-JEPA)** and **meta-memory (Titans-style)** share a single state—not RAG bolted on top.

| Metric | Assessment |
|--------|------------|
| How identified? | Platform teams split stacks: perception/world-model pretraining vs long-context memory hacks |
| Who affected? | ML platform teams, robotics/sim labs building long-horizon agents |
| Where / how often? | Multimodal agents, video+action, enterprise agents with 10k+ step tasks |
| Serious / current? | Yes—failures today: lost thread, hallucinated plans, quadratic attention cost |
| Unknown research can answer? | **Interface design**: how latents are written/read by memory; training vs test-time split |
| Solution obvious? | No—JEPA and Titans lines are separate in literature |
| Socially useful? | Yes—more reliable autonomous systems |
| Who implements? | **Platform architects** at labs/product orgs |
| Stokes | Use-inspired + applied |
| Not “lack of…”? | Yes—technical composition problem |
| Still matters 3–5y? | Yes—core to LeCun AMI vision + agent products |

**Gap (cannot solve yet):** Corpus has JEPA, V-JEPA, Titans, Dreamer, LeCun AMI—but **no unified agent** with defined latent↔memory protocol.

**Possible contribution:** Architecture + training recipe + benchmark (long-horizon needle + latent rollout tasks).

**Risk:** Heavy engineering; needs clear narrow scope (e.g. video prediction + memory, not full robotics first).

---

## Topic 2 — Decision framework: predict (world model) vs memorize vs retrieve

**One-line:** A **use-inspired framework** for architects: given task type, when world-model latents beat RAG, recurrent memory, or hybrid—and how to verify claims.

| Metric | Assessment |
|--------|------------|
| How identified? | Practitioners blindly default to RAG or bigger context; no grounded decision guide |
| Who affected? | **Decision makers**: platform leads, solution architects, R&D managers |
| Where / how often? | Every long-document / long-session agent deployment |
| Serious / current? | Yes—wrong stack → cost, latency, unreliability |
| Unknown? | **Empirical trade-offs** across task dimensions (horizon, verifiability, modality) |
| Solution obvious? | No—surveys exist but not actionable composition rules |
| Socially useful? | High—reduces wasted infra and unsafe deployments |
| Who implements? | **Managers / architects** choosing stack, not individual users |
| Stokes | Applied (strong) + use-inspired |
| Not “lack of…”? | Yes |
| 3–5y relevance? | Yes—as long as agents ≠ only chat |

**Gap:** RAG survey + MemGPT + JEPA in meta—but **no evaluable decision model** tied to measurable task properties.

**Possible contribution:** Taxonomy of tasks + small benchmark suite + “if X then Y” guidelines with evidence (PhD as **evaluated design knowledge**, lighter than new SOTA model).

**Risk:** Must run real comparisons—not only prose framework.

---

## Topic 3 — Non-generative world models for sample-efficient embodied control

**One-line:** Use **JEPA/V-JEPA-style latent prediction** (not pixel reconstruction) inside **model-based RL** (Dreamer/PlaNet lineage) for sim robotics—with measurable sample efficiency.

| Metric | Assessment |
|--------|------------|
| How identified? | Robotics/sim teams need data-efficient control; generative world models are costly |
| Who affected? | Robotics researchers, sim-to-real programs, autonomy teams |
| Where? | Sim environments (MuJoCo, Isaac, game RL)—clear evaluation |
| How often / serious? | Recurring in every embodied ML project |
| Unknown? | Whether **non-generative** latents match generative Dreamer rollouts for control |
| Solution obvious? | No—I-JEPA/V-JEPA strong on representation; control coupling open |
| Socially useful? | Yes—cheaper, safer iteration before real-world deploy |
| Who implements? | **Robotics program managers** + ML engineers |
| Stokes | Applied |
| Not “lack of…”? | Yes |
| 3–5y? | Yes—world models central to embodied AI |

**Gap:** Ha World Models, DreamerV3, PlaNet, MuZero, I-JEPA, V-JEPA—but **JEPA latents in MBRL control loop** not established in your corpus.

**Possible contribution:** JEPA-world-model agent in sim + ablations vs Dreamer baseline.

**Risk:** Needs sim stack and compute; narrower PhD if scoped to one domain (e.g. video-based control).

---

## Topic 4 — Test-time meta-memory for tool-using agents (beyond context windows)

**One-line:** Extend **Titans / RMT / MemGPT** ideas into a **tool-loop agent** where memory is explicit, updatable at test time, and auditable—not opaque KV cache growth.

| Metric | Assessment |
|--------|------------|
| How identified? | LLM agents lose state across tool calls; MemGPT and Titans address different slices |
| Who affected? | Enterprise agent builders, copilot/platform teams |
| Where? | Multi-step workflows (code, ops, research assistants) |
| How often / serious? | Daily in production agent failures |
| Unknown? | **Unified memory API** for tool agents: what to memorize, when, how to verify |
| Solution obvious? | Partial—MemGPT OS metaphor vs Titans neural memory not unified |
| Socially useful? | Yes—trustworthy long-running assistants |
| Who implements? | **Platform / product orgs** shipping agents |
| Stokes | Use-inspired + applied |
| Not “lack of…”? | Yes |
| 3–5y? | Yes—agents are product direction |

**Gap:** NTM, DNC, MemGPT, Titans, RMT in meta—but **no ingested work** on test-time memory + **tool graphs** with verifiable memory writes.

**Possible contribution:** Memory module + agent protocol + benchmark (long tool chains, needle in workflow).

**Risk:** Overlap with industry (MemGPT); differentiate via **verifiability** or **multimodal** hook to world-model latents (bridge to Topic 1).

---

## Comparison at a glance

| | Topic 1 | Topic 2 | Topic 3 | Topic 4 |
|---|---------|---------|---------|---------|
| **Core move** | New hybrid architecture | Framework + eval | Embodied MBRL + JEPA | Agent memory protocol |
| **Novelty type** | Model/system | Design knowledge | Empirical ML | System + eval |
| **Compute** | High | Medium | High (sim) | Medium |
| **Closest to current `world-models` topic** | **Direct extension** | Reframe as evaluation | Different (robotics) | Partial (memory focus) |
| **Best if you want…** | Deep ML architecture PhD | Proposal-friendly, manager audience | Robotics/sim credibility | Product-adjacent agents |

---

## Recommendation (not binding)

- **Most aligned with work so far:** **Topic 1** (your `world-models` folder is already 40% there).
- **Fastest credible proposal doc:** **Topic 2** (strong “whose problem / who implements” story).
- **Clear experiments:** **Topic 3** or **Topic 4** (benchmarks are well defined).

---

## Once you confirm

We will:

1. `npm run lab -- problem init <topic-slug>` for the chosen direction
2. Copy/adapt PROBLEM.md + GAP.md from this doc
3. Add **8–12 topic-specific papers** (not duplicate all 32 meta)
4. Fill lit matrix + 3 proposal sections (problem, gap, approach)
5. Optional: small notebook experiment for Topic 3 or 4

**Reply with:** `Topic N` (or two for shortlist) + any constraint (industry job, robotics lab, theory-light, etc.).

---

## Confirmed direction (2026-08-10)

**World models — learning and reasoning with less than trillion-scale autoregression.**

Sharpened question: *How can world-model agents (JEPA-style latent prediction + planning) achieve long-horizon competence at lower compute/sample cost than scale-only LLMs—and when does scale still win?*

Working files: `topics/world-models/PROBLEM.md`, `GAP.md`, `knowledge/scale-vs-world-models.md`, `draft/proposal.md`.
