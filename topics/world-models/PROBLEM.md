# Problem checklist

## How did you identify this problem?

- Industry assumes **reasoning requires processing everything**: trillion-parameter autoregressive models, long chain-of-thought, full pixel reconstruction—making inference cost, latency, and energy prohibitive [@s2:340f48901f72278f6bf78a04ee5b01df208cc508] [@s2:76e9e2ec3de437ffb30d8b7b629f7fe3e61de5c2].
- Humans use **intuition**: a compressed predictive model built on prior knowledge—they do not simulate every sensory detail or generate every reasoning token [@s2:775f42ed458b8c5b0f2094ea4ff5b64c557b1a34].
- LeCun’s AMI / JEPA line shows **world models** predict in **representation space** (not every token/pixel), enabling learning with **less compute and less labeled data** than scale-only paths [@s2:ee57e4d7a125f4ca8916284a857c3760d7d378d3] [@s2:872d78c04c8fb115d492eea98199407991670533].
- **Survey (400 papers):** JEPA and latent RL are strong; **compositional generalization + matched inference cost** vs exhaustive context is not jointly solved.

## Who is affected?

- ML **platform and infrastructure** teams (cost, latency, carbon)
- **Research orgs** that cannot match frontier LLM scale but need capable agents
- **Robotics / simulation** teams needing sample-efficient, compositional generalization

## Where does it occur?

- Long-horizon agents, video understanding, embodied sim, compositional vision/reasoning at scale

## How often? How serious?

- Every production agent call at scale; every project needing systematic generalization beyond training compositions
- Failures: unaffordable inference, poor compositional generalization despite scale [@s2:a62acff2ae06c50eb52fc2c610368ce95c3f2c62], hallucinated “reasoning” from exhaustive generation

## Is it current (happening now)?

- Yes — JEPA/V-JEPA 2, DreamerV3, Titans, scaling-law discourse (2024–2026); inference cost is a board-level issue

## Is there an unknown research can answer?

- **Can predictive intuition** (JEPA + latent dynamics + optional memory) achieve **compositional competence** without exhaustive context—and at **lower FLOPs per decision** than AR/scale baselines?
- **What minimal predictive state** supports systematic recombination vs brute-force data/context scale?

## Is the solution already obvious?

- No — after 400-paper survey, no standard eval ties JEPA/world models to compositional splits at matched compute (see [`GAP-ANALYSIS.md`](GAP-ANALYSIS.md))

## Is the research socially useful?

- Yes — cheaper, more reliable AI; less dependence on hyperscaler-scale compute only

## Whose problem is this? Who can implement the solution?

- **Platform architects and R&D directors** choosing model stack
- Researchers defining benchmarks that separate **structure** from **scale**

## Stokes quadrant

- [ ] Pure research
- [x] Use-inspired research
- [x] Applied research

## Reject if the problem is really about

- Lack of training / finance / awareness — this is **architecture, composition, and efficiency**

## Will this still matter in 3–5 years?

- Yes — cost of reasoning at scale and compositional reliability remain structural even if LLMs grow

## Related

- [`knowledge/intuition-vs-exhaustive-context.md`](knowledge/intuition-vs-exhaustive-context.md)
- [`survey/SCOPE.md`](survey/SCOPE.md)
