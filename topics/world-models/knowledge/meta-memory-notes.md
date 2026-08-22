# Meta-memory notes

From [@s2:5e7a795d89910634f001cc3a631023f1dd4e2e23] (Titans):

## Problem framing

- Attention = accurate short-term dependency modeling but **quadratic cost** and fixed context.
- Recurrent hidden state = compressed memory but limited expressivity.
- Titans add a **neural long-term memory module** trained to memorize history; attention handles current context.

## Research angle for world models

World models supply **predictive state**; meta-memory supplies **persistent history**. Open question: shared latent space vs separate modules with explicit read/write.

## Hook to gap

Combining JEPA latents with Titans-style memory is not covered by current ingested topic set — candidate contribution area.

## Evaluation ideas

- Needle-in-haystack beyond 2M tokens (Titans claim)
- Long-horizon planning with latent rollouts + memory readout
- Ablations: world model only vs memory only vs hybrid
