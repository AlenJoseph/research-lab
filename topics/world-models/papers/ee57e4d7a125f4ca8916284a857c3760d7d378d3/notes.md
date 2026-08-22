# Paper notes — I-JEPA

## Summary

Predicts **representations** of masked target blocks from a context block in the same image—no pixel reconstruction, minimal augmentation. Core masking: large semantic targets + spatially distributed context.

## Key claims

- Non-generative SSL can match or beat generative/reconstruction methods on downstream tasks
- Scales to ViT-H/14 on ImageNet in ~72h on 16 A100s
- Strong on linear probe, counting, depth without task-specific heads at train time

## Methods / equations

- Joint-embedding predictor: context encoder → predictor → target representation (EMA target encoder)
- Masking strategy is the main design lever (semantic scale of targets)

## Relevance to our problem/gap

- **Intuition vs exhaustive:** predicts abstract features, not every pixel—direct AMI/JEPA line for compressed prediction
- Gap: I-JEPA does not evaluate **compositional generalization** or **FLOPs-matched** AR baselines

## Limitations

- Image SSL focus; no systematic composition splits; no inference-cost comparison to generative world models
