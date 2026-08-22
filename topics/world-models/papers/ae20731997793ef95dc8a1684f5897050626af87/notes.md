# Paper notes — JEPA-Reasoner

## Summary

Decouples **latent reasoning** from **token generation**—reasoning in embedding space rather than exhaustive CoT token production.

## Key claims

- JEPA-style latent reasoning can support tasks without full autoregressive chain
- Early work on AMI-aligned “reason without every token”

## Relevance to our problem/gap

- **Backup gap 2**—latent reasoning vs token exhaust
- Needs FLOPs-matched comparison to AR CoT; compositional eval unclear

## Limitations

- Concurrent AR reasoning literature; benchmarks not yet standard for latent vs token at equal compute
