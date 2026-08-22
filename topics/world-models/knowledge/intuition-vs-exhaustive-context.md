# Intuition vs exhaustive context

**Lens for this topic:** AI should not need to “see/read everything.” **Intuition** = acting from a **compressed predictive world model** plus reusable knowledge—not from exhaustive sensory simulation or long autoregressive chains.

---

## Exhaustive context (what we contrast against)

| Pattern | Mechanism | Cost driver |
|---------|-----------|-------------|
| Autoregressive LLM | Every reasoning step is a generated token | Context length × width |
| Generative world models | Reconstruct pixels/latents densely | Decoder + rollout depth |
| Long-context attention | Attend to full history | Quadratic or linear attention over full sequence |
| RAG-only memory | Retrieve text chunks | Retrieval + AR over retrieved set |

Representative citations: [@s2:340f48901f72278f6bf78a04ee5b01df208cc508] [@s2:e6c561d02500b2596a230b341a8eb8b921ca5bf2] [@s2:8342b592fe238f3d230e4959b06fd10153c45db1]

---

## Machine intuition (structured alternative)

| Mechanism | Idea | Key papers |
|-----------|------|------------|
| **JEPA** | Predict **representations** of unseen regions—not pixels | [@s2:ee57e4d7a125f4ca8916284a857c3760d7d378d3] [@s2:872d78c04c8fb115d492eea98199407991670533] [@s2:b202faf38efbffcb26470c702e1140b047d6f6e7] |
| **Latent world models** | Imagine futures in **compressed state** for control | [@s2:ff332c21562c87cab5891d495b7d0956f2d9228b] [@s2:f2d952a183dfb0a1e031b8a3f535d9f8423d7a6e] |
| **AMI vision** | Modular predictive architectures vs AR token path | [@s2:775f42ed458b8c5b0f2094ea4ff5b64c557b1a34] |
| **Predictive memory** | Learn what to remember; predict from memory | [@s2:5e7a795d89910634f001cc3a631023f1dd4e2e23] [@s2:518b827e340c26582b5093401283a4f5cff605b9] |
| **Compositional structure** | Recombine known concepts systematically | [@s2:8cb0b1047de0bfd50f52bfb6a9f8daca4f243ec7] [@s2:1766648967f6206a944a4bd18bbbd92a74c164bd] |

---

## Research gap (validated in survey)

Surveyed **400 papers** — field excels at JEPA SSL and latent RL but **does not** jointly evaluate:

> Compositional generalization + predictive latent state + **matched inference FLOPs** vs exhaustive AR/scale.

See [`GAP-ANALYSIS.md`](../GAP-ANALYSIS.md).

---

## Related notes in this folder

- [`jepa-overview.md`](jepa-overview.md)
- [`meta-memory-notes.md`](meta-memory-notes.md)
- [`scale-vs-world-models.md`](scale-vs-world-models.md)
