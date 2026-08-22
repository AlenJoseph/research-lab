# JEPA overview

Joint-Embedding Predictive Architecture (JEPA) predicts **representations** of target regions from context — not pixels.

## Core idea (from ingested papers)

- **I-JEPA** [@s2:ee57e4d7a125f4ca8916284a857c3760d7d378d3]: predict target block representations from context blocks in the same image; masking scale matters for semantics.
- **V-JEPA** [@s2:872d78c04c8fb115d492eea98199407991670533]: same objective on video features; strong frozen-backbone downstream performance.

## Position in LeCun stack

[@s2:775f42ed458b8c5b0f2094ea4ff5b64c557b1a34] places configurable predictive world models at the center of autonomous intelligence.

## Contrast with classic world models

[@s2:ff332c21562c87cab5891d495b7d0956f2d9228b] learns generative latent dynamics for RL — generative pixel/latent rollouts vs JEPA non-generative representation prediction.

## Equations (sketch — verify against paper)

Feature predictor \(f_\theta\) maps context encoder outputs to target block representations:

\[
\hat{z}_{\text{target}} = f_\theta(\text{Enc}(x_{\text{context}}))
\]

Loss (schematic): \(\|\hat{z}_{\text{target}} - \text{Enc}(x_{\text{target}})\|^2\) with stop-gradient on target encoder (I-JEPA detail — confirm in paper).

## Try in notebook

See `notebooks/README.md` for a minimal representation-prediction toy.
