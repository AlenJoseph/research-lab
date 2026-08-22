# Scale vs world models — learning with less

## The tension (your proposal hook)

| Path | Idea | Cost driver |
|------|------|-------------|
| **Trillion-scale AR LLMs** | More parameters + more tokens → “reasoning” | Inference FLOPs per token; KV cache; long context |
| **World models (JEPA / Dreamer)** | Predict **latent state**, plan in imagination | Rollout depth × latent dim; often **no pixel/token AR** |

LeCun’s argument [@s2:775f42ed458b8c5b0f2094ea4ff5b64c557b1a34]: animals learn predictive models of the world with **far less experience** than current ML—suggesting the scaling-only path is incomplete.

## Why JEPA may “learn with less”

From [@s2:ee57e4d7a125f4ca8916284a857c3760d7d378d3]:

- Predict **representations**, not pixels → no generative decoder bottleneck
- Strong semantics **without** hand-crafted augmentation pipelines
- Scales to ViT-Huge with **modest GPU budget** vs generative SSL

From [@s2:872d78c04c8fb115d492eea98199407991670533]:

- Video understanding from **feature prediction** only
- Frozen backbone transfers across motion + appearance tasks

## Why classic world models help sample efficiency

- [@s2:ff332c21562c87cab5891d495b7d0956f2d9228b] — train policy inside **dream** (fewer env steps)
- [@s2:f2d952a183dfb0a1e031b8a3f535d9f8423d7a6e] — single recipe across many RL domains
- [@s2:c39fb7a46335c23f7529dd6f9f980462fd38653a] — MuZero: planning without full environment simulation rules

## Meta-memory without trillion context

- [@s2:5e7a795d89910634f001cc3a631023f1dd4e2e23] — long-term memory module; attention as **short-term**
- Avoids treating “reasoning” as **one giant softmax over all past tokens**

## Proposal metrics to report (not just accuracy)

1. **Data efficiency** — performance vs environment steps / labeled examples  
2. **Inference cost** — FLOPs or ms per decision vs AR baseline at matched quality  
3. **Parameter efficiency** — latent + policy size vs monolithic LLM  
4. **Horizon** — task length where world-model rollouts still beat reactive policies  

## Open empirical question (your PhD)

On which **task families** does a **small predictive core + latent rollouts** match a **much larger AR model**—and when does scale-only still win?
