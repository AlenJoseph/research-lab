# Survey scope — world models & machine intuition

## Problem lens (your idea)

Humans do not “see/read everything” to act. They use **intuition**: a compressed internal model built on prior knowledge, used to predict and compose. Much current AI equates competence with **exhaustive context** (every token, every pixel, long chain-of-thought).

**Research area (pure ML):** world models, selective/latent prediction (JEPA), meta-memory, compositional generalization—vs exhaustive autoregressive / generative training.

## Question the survey must answer

> Does the literature already solve “intuition without exhaustive context”—and if not, **where** is a defensible gap?

## Search strategy

- **Queries:** [`queries.txt`](queries.txt) (vision/world-model/JEPA) + [`queries-text.txt`](queries-text.txt) (language, latent reasoning, SCAN/CFQ)
- **Seed expand:** citation expansion from LeCun AMI, I-JEPA, V-JEPA, Ha World Models, DreamerV3, Titans (during `survey harvest --expand`)

## Seed paper IDs (for manual expand / promote)

| Paper | S2 paperId |
|-------|------------|
| A Path Towards AMI | `775f42ed458b8c5b0f2094ea4ff5b64c557b1a34` |
| I-JEPA | `ee57e4d7a125f4ca8916284a857c3760d7d378d3` |
| V-JEPA | `872d78c04c8fb115d492eea98199407991670533` |
| World Models (Ha) | `ff332c21562c87cab5891d495b7d0956f2d9228b` |
| DreamerV3 | `f2d952a183dfb0a1e031b8a3f535d9f8423d7a6e` |
| Titans | `5e7a795d89910634f001cc3a631023f1dd4e2e23` |

## Catalog vs core corpus

| Layer | Path | Purpose |
|-------|------|---------|
| Survey catalog | `survey/catalog.json` | 100–500 papers, metadata only |
| Core corpus | `papers/manifest.json` | 25–40 deep-read papers after gap validation |

## Commands

```bash
npm run lab -- survey harvest topics/world-models --target 500 --queries survey/queries-text.txt
npm run lab -- survey status topics/world-models
npm run lab -- survey analyze topics/world-models
npm run lab -- survey promote <paperId> --role topic --why "core for gap X"
```
