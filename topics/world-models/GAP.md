# Research gap (summary)

**Full analysis:** [`GAP-ANALYSIS.md`](GAP-ANALYSIS.md) (400-paper survey, ranked gaps)  
**Status:** Validated for professor discussion; confirm after meeting in [`draft/PROFESSOR-BRIEF.md`](draft/PROFESSOR-BRIEF.md)

Structure: **current problem → existing knowledge → cannot solve**

## Current real-world problem

Teams deploy **exhaustive-context** systems—large AR models, long CoT, dense reconstruction—believing competence requires seeing/processing everything. Inference cost and **compositional failures** persist [@s2:a62acff2ae06c50eb52fc2c610368ce95c3f2c62]. Humans instead use **compressed predictive intuition** to recombine concepts without exhaustive simulation.

## What existing knowledge already covers

- **JEPA/V-JEPA/V-JEPA 2** — strong visual representations without generative reconstruction [@s2:ee57e4d7a125f4ca8916284a857c3760d7d378d3] [@s2:872d78c04c8fb115d492eea98199407991670533] [@s2:b202faf38efbffcb26470c702e1140b047d6f6e7]
- **Latent world models** — sample-efficient RL via imagination [@s2:ff332c21562c87cab5891d495b7d0956f2d9228b] [@s2:f2d952a183dfb0a1e031b8a3f535d9f8423d7a6e]
- **AMI** — modular predictive architectures vs AR path [@s2:775f42ed458b8c5b0f2094ea4ff5b64c557b1a34]
- **Meta-memory** — context beyond fixed attention [@s2:5e7a795d89910634f001cc3a631023f1dd4e2e23]
- **Compositional theory** — first principles and subtask learning [@s2:8cb0b1047de0bfd50f52bfb6a9f8daca4f243ec7] [@s2:96a7642e4d33544e941de60a71aabc76c4c352ff]
- **Scale path** — scaling laws, Chinchilla, GPT-3 [@s2:e6c561d02500b2596a230b341a8eb8b921ca5bf2] [@s2:8342b592fe238f3d230e4959b06fd10153c45db1] [@s2:340f48901f72278f6bf78a04ee5b01df208cc508]

## What existing knowledge cannot yet solve (the gap)

- **No joint evaluation:** JEPA/world-model agents on **systematic compositional splits** with **FLOPs-matched** AR/data-scaling baselines (0/400 survey papers)
- Unclear **when predictive intuition suffices** vs when exhaustive context is necessary
- Missing **replicable protocol** for platform teams: structure vs scale on composition + inference cost

## Recommended gap (primary, text-aligned)

**Compositional language generalization at matched test-time FLOPs** — latent/predictive reasoning vs exhaustive CoT on SCAN/CFQ-style splits. See [`GAP-ANALYSIS.md`](GAP-ANALYSIS.md).

**Literature note:** 41 latent-reasoning papers in survey—crowded alone; gap is **composition + FLOPs**, not “latent reasoning” in isolation.

## Intended useful outcome

A **use-inspired guide**: when JEPA/world-model stacks beat exhaustive AR on compositional tasks at given FLOPs; when scale-only still wins.

## Decision-maker audience

- ML platform / infra leads
- Research directors who cannot assume trillion-parameter deployment
- Benchmark designers separating composition from memorization

## Sharpened research question (after literature review)

> Can **JEPA-style predictive world models** achieve **systematic compositional generalization** at **lower inference FLOPs** than autoregressive or data-scaling baselines—and under what task conditions does exhaustive context still dominate?

**Hypothesis/experiments:** pending professor sign-off — [`draft/HYPOTHESIS.md`](draft/HYPOTHESIS.md), [`draft/EXPERIMENT-PLAN.md`](draft/EXPERIMENT-PLAN.md)
