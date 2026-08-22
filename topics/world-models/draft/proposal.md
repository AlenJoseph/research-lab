# PhD proposal — working title

**Machine intuition: compositional prediction with world models and JEPA—not exhaustive context**

## 1. Problem

Organizations assume **competence requires exhaustive context**: trillion-parameter autoregressive models, long generated reasoning chains, dense pixel reconstruction. Inference cost and latency scale with **everything the model must process**. Yet biological intelligence uses **intuition**—a compressed predictive world model—to act and to **recombine known concepts** without simulating every detail [@s2:775f42ed458b8c5b0f2094ea4ff5b64c557b1a34].

After surveying **500 papers** (including a **text/language literature pass**), the field excels at latent reasoning and JEPA SSL, but lacks: **systematic compositional generalization in language** (SCAN/CFQ) with **matched test-time FLOPs** vs chain-of-thought.

## 2. Gap

Existing work shows:

- **JEPA/V-JEPA/V-JEPA 2** learns strong visual state without reconstruction [@s2:ee57e4d7a125f4ca8916284a857c3760d7d378d3] [@s2:872d78c04c8fb115d492eea98199407991670533] [@s2:b202faf38efbffcb26470c702e1140b047d6f6e7]
- **Latent world models** enable sample-efficient RL [@s2:ff332c21562c87cab5891d495b7d0956f2d9228b] [@s2:f2d952a183dfb0a1e031b8a3f535d9f8423d7a6e]
- **Compositional generalization** is hard; data scaling may not suffice [@s2:a62acff2ae06c50eb52fc2c610368ce95c3f2c62]
- **Meta-memory** extends context [@s2:5e7a795d89910634f001cc3a631023f1dd4e2e23]

**Missing:** unified evaluation on **SCAN/CFQ-style systematic splits** comparing **latent/predictive reasoning** (JEPA-Reasoner, looped LM, continuous latent) vs **CoT AR** at **matched test-time FLOPs**. Generic latent reasoning is crowded (41 survey papers). See [`GAP-ANALYSIS.md`](../GAP-ANALYSIS.md).

## 3. Research question

Can **latent/predictive reasoning** achieve **systematic compositional generalization** on **language** benchmarks (SCAN/CFQ) at **lower test-time FLOPs** than chain-of-thought autoregression—and does the same hold for compositional **vision** as a secondary testbed?

## 4. Approach (after professor sign-off)

Detailed in [`EXPERIMENT-PLAN.md`](EXPERIMENT-PLAN.md) (pending):

1. **SCAN / CFQ** compositional language splits (primary)
2. **Baseline ladder** — CoT AR, looped LM, recurrent-depth latent, JEPA-Reasoner, continuous latent
3. **Metrics** — systematic vs random accuracy, compositional gap, **FLOPs per example**
4. **Optional** — compositional vision track; Titans-style memory in Year 2

## 5. Expected contribution

- Empirical **Pareto curves** (success vs FLOPs) separating **predictive structure** from **exhaustive context**
- **Use-inspired guidance** for teams that cannot assume trillion-parameter deployment
- Not a single ImageNet SOTA claim—a **when-to-use-what** map for compositional tasks

## 6. Literature foundation

- Comprehensive review: [`LITERATURE-REVIEW.md`](LITERATURE-REVIEW.md)
- Survey: 500 papers in [`survey/catalog.json`](../survey/catalog.json); text pass via [`queries-text.txt`](../survey/queries-text.txt)
- Professor checkpoint: [`PROFESSOR-BRIEF.md`](PROFESSOR-BRIEF.md)

## 7. Audience

ML platform architects, research directors, benchmark designers.

---

*Hypothesis and experiments are explicitly pending professor validation—see [`HYPOTHESIS.md`](HYPOTHESIS.md).*
