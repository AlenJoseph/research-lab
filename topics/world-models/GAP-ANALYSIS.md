# Gap analysis — world models & machine intuition

**Survey basis:** 500 unique Semantic Scholar papers in [`survey/catalog.json`](survey/catalog.json) (vision harvest + **text/language pass** via [`survey/queries-text.txt`](survey/queries-text.txt)). Thematic reports: [`survey/COVERAGE-MATRIX.md`](survey/COVERAGE-MATRIX.md), [`survey/THEMES.md`](survey/THEMES.md), [`survey/ALREADY-SOLVED.md`](survey/ALREADY-SOLVED.md).

**Core corpus:** 36 papers promoted for deep read in [`papers/manifest.json`](papers/manifest.json) (+ 32 meta foundations), including **6 new text/latent-reasoning papers** from the language literature pass.

---

## Executive summary

The field **does not** already solve “intuition without exhaustive context.” It solves **pieces**:

| Piece | Status in literature |
|-------|----------------------|
| Non-generative visual prediction (JEPA) | Strong — 102 catalog papers; I-JEPA, V-JEPA, V-JEPA 2 |
| Latent imagination for RL | Mature line — Ha, PlaNet, DreamerV3 (85 “world model” papers) |
| Compositional generalization | Active — **77** catalog papers; top cited are **language** (SCAN, semantic parsing) [@s2:21f74e2617d8d8f5fc117ff2ad6e58a540541f6d] |
| Latent reasoning (text) | **Surging** — **41** papers (2024–2025): looped LMs, continuous latent space, test-time compute [@s2:cbc1363d0c55abb60aa9c0e5a7ca0798ce86a752] [@s2:699182cd5d28248f8a01734a9991c6c147145aa0] |
| Language / NLP reasoning | **136** keyword-tagged papers in expanded catalog |
| Memory beyond fixed attention | Emerging — Titans, NTM/DNC, RAG; **24** memory-tagged |
| Scale-only reasoning | Dominant baseline — scaling laws, Chinchilla, GPT-3 in core corpus |

**Text literature pass (queries-text.txt):** Added 100 papers from latent-reasoning query alone. **54 papers** sit at language ∩ (latent reasoning **or** composition). **0 papers** combine **JEPA + compositional generalization** (vision or text).

**No unified thread** evaluates whether **compressed predictive / latent reasoning** achieves **systematic compositional generalization** at **lower inference cost** than exhaustive chain-of-thought or autoregressive scaling—with a **replicable protocol**.

**Recommended PhD gap (primary, text-aligned):** **compositional language generalization** under **matched test-time compute**—latent/predictive reasoning (JEPA-Reasoner, looped LM, continuous latent space) vs **exhaustive CoT tokens** on SCAN/CFQ-style splits.

**Backup gap:** same question on **compositional vision** (JEPA/V-JEPA testbed) for cross-modality evidence.

**Crowded (avoid as standalone PhD):** generic **latent reasoning** without compositional eval or FLOPs accounting—41 papers and growing [@s2:0ba7e537a1728d6b40d9ff16105f6207900fbb01].

---

## Ranked candidate gaps

### Gap 1 (recommended primary): Compositional language generalization without exhaustive CoT

| Checklist item | Evidence |
|----------------|----------|
| **Current problem** | Language models must generalize to novel **compositions** of primitives (SCAN holdouts, CFQ splits); scaling CoT tokens and context is expensive and may not yield **systematic** generalization [@s2:21f74e2617d8d8f5fc117ff2ad6e58a540541f6d]. |
| **What catalog covers** | 77 composition papers; SCAN/semantic parsing line [@s2:21f74e2617d8d8f5fc117ff2ad6e58a540541f6d]; theory [@s2:8cb0b1047de0bfd50f52bfb6a9f8daca4f243ec7]; latent reasoning surge [@s2:cbc1363d0c55abb60aa9c0e5a7ca0798ce86a752] [@s2:699182cd5d28248f8a01734a9991c6c147145aa0] [@s2:673fbdd957cada770d10dffca5e45b53da43a3c6]. |
| **What they cannot solve** | Latent reasoning papers optimize general reasoning / test-time compute—not **compositional splits** at **matched FLOPs** vs CoT. JEPA-Reasoner [@s2:ae20731997793ef95dc8a1684f5897050626af87] decouples latent reasoning from tokens but lacks SCAN/CFQ + FLOPs protocol. **0 catalog papers** on JEPA + compositional generalization. |
| **Risk: already done** | [@s2:21f74e2617d8d8f5fc117ff2ad6e58a540541f6d] (SCAN MLM vs specialized); latent reasoning survey [@s2:0ba7e537a1728d6b40d9ff16105f6207900fbb01]. **Mitigation:** joint eval—**composition + test-time FLOPs** vs exhaustive CoT, not “latent reasoning” alone. |

### Gap 2 (backup): Compositional vision via JEPA / world models

| Checklist item | Evidence |
|----------------|----------|
| **Current problem** | Same intuition thesis in **vision**—recombine visual concepts without exhaustive pixels/tokens. |
| **What catalog covers** | JEPA vision line; [@s2:a62acff2ae06c50eb52fc2c610368ce95c3f2c62] data scaling vs visual composition. |
| **What they cannot solve** | No standard JEPA + systematic vision composition + FLOPs ladder. |
| **Risk** | Vision JEPA SSL crowded (102 papers); use as **secondary testbed** not sole pitch. |

### Gap 3 (crowded — not primary): Generic latent reasoning without composition

| Checklist item | Evidence |
|----------------|----------|
| **Current problem** | CoT token exhaust at inference [@s2:340f48901f72278f6bf78a04ee5b01df208cc508]. |
| **What catalog covers** | **41 papers** including [@s2:ae20731997793ef95dc8a1684f5897050626af87], looped LMs, continuous latent space, hidden reasoners [@s2:1269b49d9f6e98a40127cdbaf4e8f0899643b6e1]. |
| **Why not primary** | Fast-moving, crowded; hard to claim novelty without compositional or FLOPs-matched axis. |

### Gap 3 (secondary): Predictive memory vs retrieval-only long context

| Checklist item | Evidence |
|----------------|----------|
| **Current problem** | Long-context needs exceed attention windows; RAG retrieves but does not **predict** [@s2:46f9f7b8f88f72e12cbdb21e3311f995eb6e65c5] survey line in core corpus. |
| **What catalog covers** | Titans [@s2:5e7a795d89910634f001cc3a631023f1dd4e2e23]; NTM/DNC [@s2:518b827e340c26582b5093401283a4f5cff605b9]; **24** memory-tagged survey papers.
| **What they cannot solve** | Unclear when **learned predictive memory** beats **retrieval + AR** for compositional or planning tasks. |
| **Risk: already done** | Titans, MemGPT-style systems; crowded if framed as “long context” only. |

### Gap 4 (weak — avoid as primary): Sample-efficient RL world models

| Crowded | 113 RL-tagged papers; DreamerV3 [@s2:f2d952a183dfb0a1e031b8a3f535d9f8423d7a6e] is strong baseline. Only pursue if tied to **composition** or **intuition** eval. |

---

## Recommended direction for PhD

**Primary:** Gap 1 — **Compositional language generalization** on SCAN/CFQ-style systematic splits: compare **latent/predictive reasoning** (JEPA-Reasoner, looped LM [@s2:699182cd5d28248f8a01734a9991c6c147145aa0], continuous latent [@s2:673fbdd957cada770d10dffca5e45b53da43a3c6]) vs **chain-of-thought AR** at **matched test-time FLOPs**.

**Secondary testbed:** Gap 2 — compositional **vision** (JEPA/CLEVR-style) for cross-modality evidence.

**Avoid standalone:** generic latent reasoning (41 papers) without composition + FLOPs accounting.

---

## Do not research (solved or crowded)

- ImageNet-only JEPA SSL without composition or compute accounting
- Single-environment Dreamer SOTA without intuition/composition axis
- “Trillion parameters” engineering without predictive-state comparison [@s2:fdacf2a732f55befdc410ea927091cad3b791f13]
- RAG for long documents without predictive world state
- Generic **latent reasoning** papers without compositional eval or FLOPs ladder [@s2:0ba7e537a1728d6b40d9ff16105f6207900fbb01]

---

## Link to visualization

Core paper relations: [`graph/relations.html`](graph/relations.html) (regenerate after `graph sync` + `graph viz`).

---

## Next steps

1. Professor validation of Gap 1 vs backup (see [`draft/PROFESSOR-BRIEF.md`](draft/PROFESSOR-BRIEF.md))
2. After sign-off: [`draft/HYPOTHESIS.md`](draft/HYPOTHESIS.md) + [`draft/EXPERIMENT-PLAN.md`](draft/EXPERIMENT-PLAN.md)
3. Update [`GAP.md`](GAP.md) once gap is confirmed
