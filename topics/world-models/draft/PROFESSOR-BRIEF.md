# Professor brief — machine intuition vs exhaustive context

**Student:** PhD literature-first checkpoint (survey → gap → review → direction)  
**Date:** 2026-08-10 (updated after **text/language literature pass**)  
**Bring:** [`LITERATURE-REVIEW.md`](LITERATURE-REVIEW.md), [`GAP-ANALYSIS.md`](../GAP-ANALYSIS.md), [`graph/relations.html`](../graph/relations.html), [`survey/COVERAGE-MATRIX.md`](../survey/COVERAGE-MATRIX.md)

---

## Motivation (intuition thesis)

Humans reason with **intuition**: a compressed internal model—not by generating every intermediate token (chain-of-thought) or processing every pixel. I want to study when **latent/predictive reasoning** beats **exhaustive context** on tasks that require **recombining known concepts** (compositional generalization), at **matched inference cost**.

This is **text-first** in my conversations; vision (JEPA) remains a secondary testbed for the same principle.

---

## What I did

- **500-paper survey** ([`survey/catalog.json`](../survey/catalog.json)): vision harvest + **text pass** via [`queries-text.txt`](../survey/queries-text.txt).
- Thematic counts: **136 language**, **41 latent reasoning**, **77 composition** (many SCAN/semantic parsing), 102 JEPA, 94 world-model ([`COVERAGE-MATRIX.md`](../survey/COVERAGE-MATRIX.md)).
- **36 core papers** deep-read ([`papers/manifest.json`](../papers/manifest.json)), including 6 new from text pass: looped LM, recurrent-depth latent reasoning, continuous latent space, SCAN composition, latent-reasoning survey.
- [`LITERATURE-REVIEW.md`](LITERATURE-REVIEW.md) — citations only from catalog/core/meta.

---

## Evidence the gap is real (literature-backed)

| What the field already shows | What is still open |
|------------------------------|-------------------|
| **Latent reasoning** is surging (41 papers): looped LMs [@s2:699182cd5d28248f8a01734a9991c6c147145aa0], test-time latent compute [@s2:cbc1363d0c55abb60aa9c0e5a7ca0798ce86a752], continuous latent space [@s2:673fbdd957cada770d10dffca5e45b53da43a3c6] | These papers rarely use **SCAN/CFQ systematic splits** or report **FLOPs-matched** vs CoT |
| **Compositional language** is well-studied [@s2:21f74e2617d8d8f5fc117ff2ad6e58a540541f6d] | Not tied to **predictive/JEPA-style** latent reasoning at matched compute |
| JEPA-Reasoner [@s2:ae20731997793ef95dc8a1684f5897050626af87] decouples latent reasoning from tokens | No standard compositional + FLOPs protocol |
| JEPA vision (I/V-JEPA) strong on SSL | **0 catalog papers** combine **JEPA + compositional generalization** (text or vision) |

**Key survey stat:** 54 papers at language ∩ (latent reasoning or composition); **0** at JEPA ∩ composition.

**Honest crowded area:** generic latent reasoning alone is **not** the gap—[@s2:0ba7e537a1728d6b40d9ff16105f6207900fbb01] survey shows rapid growth. The defensible gap is **composition + matched test-time FLOPs** vs exhaustive CoT.

---

## Proposed direction (tentative)

**Primary (text):** **Compositional intuitive prediction in language** — SCAN / CFQ / semantic-parsing systematic splits; compare latent reasoning family (JEPA-Reasoner, looped LM, continuous latent) vs **chain-of-thought AR** at **matched test-time FLOPs**.

**Secondary (vision):** compositional vision / JEPA if we want cross-modality evidence (CLEVR-style).

---

## Questions for you

1. Is **language compositional generalization + FLOPs-matched latent vs CoT** defensible given the crowded latent-reasoning literature?
2. Preferred benchmarks: **SCAN**, **CFQ**, task-oriented semantic parsing—or others in your group?
3. Baselines: CoT AR, looped LM [@s2:699182cd5d28248f8a01734a9991c6c147145aa0], recurrent depth [@s2:cbc1363d0c55abb60aa9c0e5a7ca0798ce86a752], JEPA-Reasoner—which are mandatory?
4. Should Year 1 stay **text-only**, or run a smaller **vision** compositional track in parallel?
5. Memory (Titans [@s2:5e7a795d89910634f001cc3a631023f1dd4e2e23]) in scope early or after core composition results?

---

## Not yet proposed (awaiting sign-off)

[`HYPOTHESIS.md`](HYPOTHESIS.md) and [`EXPERIMENT-PLAN.md`](EXPERIMENT-PLAN.md) — pending this meeting.

---

## One-line pitch

> I surveyed 500 papers; latent reasoning in language is crowded, but **nobody tests compositional generalization (SCAN-style) with latent/predictive reasoning vs exhaustive CoT at matched FLOPs**—that’s the text-aligned gap I want to pursue.
