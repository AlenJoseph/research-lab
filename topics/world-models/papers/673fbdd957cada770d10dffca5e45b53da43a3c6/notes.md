# Paper notes — Continuous Latent Space Reasoning (Coconut line)

## Summary

Trains LLMs to reason in a **continuous latent space** rather than explicit chain-of-thought tokens—reasoning trajectory as latent states before answer generation.

## Key claims

- Latent reasoning can match or improve on CoT with different compute profile
- Part of 2024–2025 surge in non-token reasoning for language models

## Relevance

- **Text-native intuition:** reason without emitting every intermediate token
- Baseline/competitor for FLOPs-matched comparison vs JEPA-Reasoner

## Limitations

- Crowded latent-reasoning area (41 catalog papers); compositional SCAN/CFQ eval unclear
