# Experiment plan — PENDING PROFESSOR SIGN-OFF

**Status:** Draft only. Execute after professor validates direction in [`PROFESSOR-BRIEF.md`](PROFESSOR-BRIEF.md).

**Modality:** **Text/language primary** (literature-backed); vision track optional.

---

## Benchmark choice (provisional)

**Primary family:** Compositional **language** benchmarks with systematic splits:

| Benchmark | Role |
|-----------|------|
| **SCAN** (length / primitive holdouts) | Core systematic generalization [@s2:21f74e2617d8d8f5fc117ff2ad6e58a540541f6d] |
| **CFQ** or COGS-style splits | Stronger composition / semantic parsing |
| Task-oriented semantic parsing (optional) | Realistic compositional structure |

**Held-out compositions** never seen in training—not i.i.d. test only.

**Secondary (optional):** CLEVR-style compositional **vision** for cross-modality check (JEPA vs AR).

---

## Baseline ladder (text)

| Tier | Model | Role |
|------|-------|------|
| B0 | Standard LM + fine-tune (no CoT) | Reactive |
| B1 | LM + **chain-of-thought** AR | Exhaustive token reasoning |
| B2 | **Looped LM** [@s2:699182cd5d28248f8a01734a9991c6c147145aa0] | Latent iteration |
| B3 | **Recurrent depth / test-time latent** [@s2:cbc1363d0c55abb60aa9c0e5a7ca0798ce86a752] | Test-time compute in latent space |
| B4 | **Continuous latent reasoning** [@s2:673fbdd957cada770d10dffca5e45b53da43a3c6] | Non-token trajectory |
| B5 | **JEPA-Reasoner** [@s2:ae20731997793ef95dc8a1684f5897050626af87] | JEPA-style latent + talker |
| B6 (opt.) | Titans + latent core [@s2:5e7a795d89910634f001cc3a631023f1dd4e2e23] | Memory |

**Vision baselines (secondary):** I-JEPA [@s2:ee57e4d7a125f4ca8916284a857c3760d7d378d3], Dreamer-class [@s2:f2d952a183dfb0a1e031b8a3f535d9f8423d7a6e], data-scaled SSL [@s2:a62acff2ae06c50eb52fc2c610368ce95c3f2c62].

---

## Experiments

### E1 — Compositional generalization (text, H1)

**Goal:** Systematic splits on SCAN / CFQ.

**Metrics:**
- Accuracy on **systematic** vs **random** / i.i.d. test
- **Compositional gap** = random acc − systematic acc

**Success criterion:** Latent-reasoning model reduces compositional gap vs CoT AR (B1) at matched training budget.

---

### E2 — Test-time FLOPs vs success (text, H2)

**Goal:** FLOPs-matched comparison—core to intuition thesis.

**Metrics:**
- **FLOPs per example** (latent loops, CoT tokens, recurrent depth steps)
- Success vs FLOPs Pareto curve (AUC)

**Protocol:** Sweep latent depth / loop count / CoT length to match FLOPs bins; plot curves.

**Success criterion:** Latent family dominates CoT at ≥2 FLOPs operating points on systematic splits.

---

### E3 — Pretraining ablation (text, H3)

**Goal:** Separate latent objective from MLM pretraining [@s2:21f74e2617d8d8f5fc117ff2ad6e58a540541f6d].

**Metrics:** Same as E1 at matched pretraining + matched FLOPs.

---

### E4 (optional) — Vision compositional track (H4)

**Goal:** Same FLOPs ladder on compositional vision benchmark.

---

### E5 (optional Year 2) — Memory (H5)

Titans-style module vs deeper latent loops at matched FLOPs.

---

## Reporting checklist

- [ ] Systematic vs random splits documented (SCAN split names explicit)
- [ ] FLOPs include latent loops / CoT tokens / recurrent depth
- [ ] Compare against crowded latent-reasoning baselines (looped LM, recurrent depth)—not only CoT
- [ ] Cite only ingested papers

---

## After sign-off

Run E1–E3 (text); update [`proposal.md`](proposal.md) and [`GAP.md`](../GAP.md).
