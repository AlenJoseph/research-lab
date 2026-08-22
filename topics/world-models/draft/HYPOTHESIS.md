# Hypothesis — PENDING PROFESSOR SIGN-OFF

**Status:** Do not treat as final until professor validates gap in [`PROFESSOR-BRIEF.md`](PROFESSOR-BRIEF.md) meeting.

**Prerequisite documents:** [`GAP-ANALYSIS.md`](../GAP-ANALYSIS.md), [`LITERATURE-REVIEW.md`](LITERATURE-REVIEW.md)

**Modality:** **Text/language primary** (after literature pass); vision secondary.

---

## Provisional research question

On **systematic compositional splits** in language (SCAN/CFQ-style), does **latent/predictive reasoning** achieve higher generalization than **chain-of-thought autoregression** at **matched test-time FLOPs**?

---

## Provisional falsifiable hypotheses

**H1 (composition, text).** Latent-reasoning models (JEPA-Reasoner [@s2:ae20731997793ef95dc8a1684f5897050626af87], looped LM [@s2:699182cd5d28248f8a01734a9991c6c147145aa0], or continuous latent [@s2:673fbdd957cada770d10dffca5e45b53da43a3c6]) attain higher accuracy on **held-out compositional splits** than CoT-matched AR baselines at **≤** matched inference FLOPs.

**H2 (compute, text).** On SCAN/CFQ systematic splits, latent-reasoning models show **steeper success-vs-FLOPs curves** than CoT AR (including test-time compute scaling [@s2:cbc1363d0c55abb60aa9c0e5a7ca0798ce86a752]).

**H3 (not just pretraining).** Gains **do not** reduce to MLM pretraining alone [@s2:21f74e2617d8d8f5fc117ff2ad6e58a540541f6d]—latent reasoning objective adds measurable compositional benefit at matched FLOPs.

**H4 (optional, vision secondary).** Same pattern holds on compositional **vision** splits with JEPA-style predictors vs AR/generative baselines [@s2:ee57e4d7a125f4ca8916284a857c3760d7d378d3].

**H5 (optional, Year 2+).** Titans-style memory [@s2:5e7a795d89910634f001cc3a631023f1dd4e2e23] improves long compositional sequences without proportional FLOPs vs enlarging latent depth alone.

---

## Null outcomes (also valuable)

- CoT AR wins at all FLOPs on composition → document where **token exhaust** is necessary.
- Latent reasoning wins on generic benchmarks but not systematic splits → gap is **evaluation**, not architecture.

---

## After sign-off

Refine metrics in [`EXPERIMENT-PLAN.md`](EXPERIMENT-PLAN.md) and update [`proposal.md`](proposal.md).
