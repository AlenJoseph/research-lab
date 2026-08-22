# Literature review — world models, JEPA, and intuition vs exhaustive context

**Scope:** Pure ML — predictive world models, selective/latent prediction, meta-memory, compositional generalization, contrasted with scale-only autoregressive training.

**Sources:** Survey catalog (400 papers, metadata in [`survey/catalog.json`](../survey/catalog.json)); core corpus (30 papers in [`papers/manifest.json`](../papers/manifest.json)); meta foundations (32 papers in [`meta/papers/manifest.json`](../../../meta/papers/manifest.json)). **All citations below use ingested S2 IDs only.**

---

## 1. Introduction and scope

**Motivation.** Much current AI treats competence as **processing everything**: every token in context, every pixel via reconstruction, every reasoning step as generated text. Human **intuition** instead uses a **compressed predictive model** built on prior knowledge—predicting in representation space, not exhaustively simulating the world in raw sensory form [@s2:775f42ed458b8c5b0f2094ea4ff5b64c557b1a34].

**Survey question.** Does the literature already deliver “intuition without exhaustive context”? This review synthesizes 400 surveyed papers and 30+ deeply read core papers to answer: what is **agreed**, what is **solved**, and what **validated gap** remains (see Section 9).

---

## 2. Foundations

Deep learning scaled representation learning and compute [@s2:2913c2bf3f92b5ae369400a42b2d27cc5bc05ecb]. **Scaling laws** [@s2:e6c561d02500b2596a230b341a8eb8b921ca5bf2] show power-law improvements with model size, data, and compute—establishing the **scale-only** path as the dominant industrial baseline. **GPT-3** [@s2:340f48901f72278f6bf78a04ee5b01df208cc508] demonstrated few-shot behavior at 175B parameters, reinforcing autoregressive sequence modeling as the default “reasoning” interface.

**Chinchilla** [@s2:8342b592fe238f3d230e4959b06fd10153c45db1] refined the scaling recipe: for fixed compute, **smaller models on more data** often beat oversized undertrained models—yet the paradigm remains **train big, attend to full context at inference**. **Foundation models** [@s2:76e9e2ec3de437ffb30d8b7b629f7fe3e61de5c2] homogenize capabilities but inherit deployment cost and failure modes at scale.

**Contrast axis for this review:** structured **predictive state** vs **brute-scale autoregression**.

---

## 3. World models and latent dynamics

**Ha & Schmidhuber** [@s2:ff332c21562c87cab5891d495b7d0956f2d9228b] introduced learning compact policies from a **latent dynamics model**—agents learn in “dream” rollouts, reducing environment interaction. **PlaNet** [@s2:270b95262f2100c279c4c65ef2521473841ca8ad] plans in latent space from pixels. **Dream to Control** [@s2:fea3e63c97c7292dc6fbcb3ffe7131eb54053986] and **DreamerV3** [@s2:f2d952a183dfb0a1e031b8a3f535d9f8423d7a6e] generalize model-based RL across domains with recurrent state-space models.

**LeCun’s AMI** [@s2:775f42ed458b8c5b0f2094ea4ff5b64c557b1a34] positions **world models** as modules that predict in abstract representation space—an alternative to autoregressive token prediction for autonomous intelligence.

**Survey coverage:** 85 catalog papers tag world-model / latent-planning themes; 113 tag RL/sample efficiency. The field **agrees** latent imagination improves **sample efficiency** in RL; it does **not** yet standardize **compositional** or **inference-cost** comparisons vs AR models.

**Attribute-factored and multi-object models** [@s2:351df52b955b7663de307bf7d9360c39dcc223aa] push toward structured latent state for multi-entity scenes—relevant to composition but evaluated on RL efficiency, not systematic generalization splits.

---

## 4. Selective / non-generative prediction (JEPA line)

**I-JEPA** [@s2:ee57e4d7a125f4ca8916284a857c3760d7d378d3] predicts **representations** of masked regions from context blocks—no pixel reconstruction, no heavy augmentation. **V-JEPA** [@s2:872d78c04c8fb115d492eea98199407991670533] extends feature prediction to video with strong frozen-backbone downstream performance. **V-JEPA 2** [@s2:b202faf38efbffcb26470c702e1140b047d6f6e7] adds understanding, prediction, and planning from video.

**LeWorldModel** [@s2:530dab86cb8034bc12a32d21508aaa3f2cc00aa1] trains end-to-end JEPA from pixels toward stable world models. **Physical planning with JEPA world models** [@s2:35fc38884dacfaf54e87d739fdb4104bc49b63e5] analyzes what drives success in embodied planning. **JEPA for RL** [@s2:067b7dfc2515e7422e3c127685b0f130248e9b43] investigates JEPA architectures inside RL loops.

**Slow features** [@s2:ed009b7423dcfec47708fb5817ec4955e4265757] and **auxiliary tasks** [@s2:7adf1ba5bdf086c43269a7e54c9e0d0293a6599a] clarify representation objectives that make JEPA predict semantically stable structure.

**Survey coverage:** 102 JEPA-tagged papers; 154 predictive/self-supervised. **Agreement:** non-generative prediction learns strong visual representations efficiently. **Open:** systematic **compositional** evaluation and **FLOPs-matched** comparison to generative world models and AR baselines.

---

## 5. Memory and long context

**NTM** [@s2:518b827e340c26582b5093401283a4f5cff605b9] and **DNC** [@s2:46f9f7b8f88f72e12cbdb21e3311f995eb6e65c5] learn to read/write external memory for sequence tasks. **Titans** [@s2:5e7a795d89910634f001cc3a631023f1dd4e2e23] introduce neural long-term memory that **learns at test time**, scaling past 2M context with strong needle-in-haystack performance.

**RAG** surveys [@s2:46f9f7b8f88f72e12cbdb21e3311f995eb6e65c5] document retrieval-augmented generation—**retrieving** past text rather than **predicting** latent state.

**Survey coverage:** 24 memory-tagged papers in catalog. **Gap:** when **predictive memory + latent reasoning** beats **retrieval + CoT** for compositional tasks.

---

## 5b. Latent reasoning in language (text literature pass)

A **2024–2025 surge** in reasoning **without exhaustive CoT tokens** (41 catalog papers):

- **JEPA-Reasoner** [@s2:ae20731997793ef95dc8a1684f5897050626af87] — latent reasoning module + separate talker for tokens
- **Looped language models** [@s2:699182cd5d28248f8a01734a9991c6c147145aa0] — recurrent hidden-state “thinking”
- **Test-time latent compute** [@s2:cbc1363d0c55abb60aa9c0e5a7ca0798ce86a752] — recurrent depth scaling
- **Continuous latent space** [@s2:673fbdd957cada770d10dffca5e45b53da43a3c6] — reasoning trajectory in embedding space
- **Hidden reasoners** [@s2:1269b49d9f6e98a40127cdbaf4e8f0899643b6e1] — unlock latent CoT via self-rewarding
- **Survey** [@s2:0ba7e537a1728d6b40d9ff16105f6207900fbb01] — field map (crowded, fast-moving)

**Survey coverage:** 136 language-tagged papers after [`queries-text.txt`](../survey/queries-text.txt) harvest. **Agreement:** latent reasoning is viable. **Open:** **SCAN/CFQ systematic splits** + **FLOPs-matched** comparison vs CoT—not standard in this literature.

---

## 6. Scale vs structure (contrast section)

| Approach | Mechanism | Strength | Cost driver |
|----------|-----------|----------|-------------|
| AR LLM (GPT-3) | Predict every token | Broad few-shot | Context length × model width |
| Scaling laws / Chinchilla | More params + data | Predictable gains | Training + inference FLOPs |
| Switch Transformer | Sparse MoE scale | Engineering scale [@s2:fdacf2a732f55befdc410ea927091cad3b791f13] | Routing + memory |
| JEPA | Predict latent features | Sample-efficient SSL | Encoder + predictor |
| Dreamer | Latent imagination | RL sample efficiency | Rollout depth × model |
| Titans | Learned memory | Long context | Memory module + attention |

**Data scaling vs composition** [@s2:a62acff2ae06c50eb52fc2c610368ce95c3f2c62] directly questions whether more data yields visual compositional generalization—critical for positioning **structure** over **scale**.

---

## 7. Compositional generalization

**First principles** [@s2:8cb0b1047de0bfd50f52bfb6a9f8daca4f243ec7] formalize compositional generalization requirements. **Composing representation transformations** [@s2:1766648967f6206a944a4bd18bbbd92a74c164bd] learns reusable transforms for systematic generalization. **Robust subtask learning** [@s2:96a7642e4d33544e941de60a71aabc76c4c352ff] addresses composition in RL.

**Transformers as meta-RL** [@s2:90cd70aef56e83c8888004fc738e0f5f3f68c620] show in-context learning connections to meta-reinforcement.

**SCAN / semantic parsing** [@s2:21f74e2617d8d8f5fc117ff2ad6e58a540541f6d] is the canonical **language** compositional benchmark family (primitive and length holdouts).

**Survey coverage:** 77 composition-tagged papers—**top cited include language** (SCAN, semantic parsing), not only vision. **Not** integrated with latent-reasoning / JEPA objectives at matched FLOPs.

## 8. Synthesis — what the field agrees on

1. **Latent prediction** (JEPA, world models) is a credible alternative to pixel/token reconstruction for learning useful state.
2. **Model-based RL** with imagination reduces environment samples compared to model-free methods on many domains.
3. **Scale-only AR** remains the default for language reasoning and broad deployment; compute-optimal training helps but does not replace inference cost of long contexts.
4. **Compositional generalization** is hard in **language** (SCAN) and vision; MLM pretraining helps but does not close the gap [@s2:21f74e2617d8d8f5fc117ff2ad6e58a540541f6d].
5. **Latent reasoning** in language is **crowded** (41 papers) but rarely evaluated on **systematic composition** at **matched FLOPs** vs CoT.
6. **Memory modules** extend context but are not unified with latent reasoning under one compositional eval protocol.

---

## 9. Validated gap (from GAP-ANALYSIS)

After surveying **500 papers** (including text/language pass), **no work directly tests**: latent/predictive reasoning on **systematic compositional language splits** with **matched test-time FLOPs** vs chain-of-thought autoregression. **0 papers** combine JEPA + compositional generalization.

**Recommended direction (text-primary):** compositional **language** generalization (SCAN/CFQ) comparing latent reasoning family vs exhaustive CoT at matched FLOPs. **Secondary:** compositional vision for cross-modality evidence.

**Crowded (avoid as sole pitch):** generic latent reasoning without composition + FLOPs [@s2:0ba7e537a1728d6b40d9ff16105f6207900fbb01].

See [`GAP-ANALYSIS.md`](../GAP-ANALYSIS.md) for ranked gaps, “do not research” list, and closest prior work.

---

## 10. Implications and open questions (not hypothesis yet)

- Which compositional benchmarks best separate **predictive structure** from **memorization**?
- Does JEPA pretraining transfer to compositional downstream without generative fine-tuning?
- When does latent “reasoning” [@s2:ae20731997793ef95dc8a1684f5897050626af87] beat token CoT at equal compute?
- Can Titans-style memory reduce predictor size needed for long-horizon compositional tasks?

**Professor sign-off required** before falsifiable hypotheses and experiments (Phase 7).

---

## Appendix: survey statistics

| Metric | Value |
|--------|-------|
| Survey catalog papers | 500 |
| Language-tagged (catalog) | 136 |
| Latent reasoning (catalog) | 41 |
| Core corpus papers | 36 |
| Meta foundations | 32 |
| JEPA-tagged (catalog) | 102 |
| Composition-tagged | 73 |
| World-model-tagged | 85 |
| Memory-tagged | 16 |

Queries: see [`survey/queries.txt`](../survey/queries.txt).
