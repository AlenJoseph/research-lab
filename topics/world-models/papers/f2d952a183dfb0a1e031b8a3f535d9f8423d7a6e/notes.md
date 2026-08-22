# Paper notes — DreamerV3

## Summary

Generalist **world-model RL** agent mastering diverse domains (120+ tasks) with fixed hyperparameters—RSSM-style latent dynamics + actor-critic from imagination.

## Key claims

- First algorithm to collect diamonds in Minecraft from scratch without human data
- Strong across continuous control, Atari, procgen, etc.
- Demonstrates world models as **generalist** MBRL backbone

## Methods / equations

- Recurrent state-space model; imagined trajectories for policy/value gradients
- Symlog predictions, normalization—engineering for stability across domains

## Relevance to our problem/gap

- Strong baseline for **generative/latent dynamics** path in our baseline ladder (B2)
- Does not target compositional systematic splits or inference FLOPs vs JEPA

## Limitations

- Reward/env-step metrics; crowded area (113 RL papers in survey)—use only with composition + compute axis
