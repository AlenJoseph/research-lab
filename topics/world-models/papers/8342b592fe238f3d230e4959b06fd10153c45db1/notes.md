# Paper notes — Chinchilla

## Summary

Compute-optimal LLM training: for fixed FLOPs, **smaller models on more data** beat oversized undertrained models (Chinchilla 70B vs Gopher 280B).

## Key claims

- Model size and training tokens should scale **equally** for compute-optimal training
- Chinchilla beats larger models on MMLU and broad downstream tasks with less inference cost

## Relevance to our problem/gap

- **Scale path baseline (B3)**—data vs parameters trade-off
- Still AR/token paradigm; contrast with **structure** (JEPA) at matched FLOPs on composition

## Limitations

- Language-only; does not address compositional vision or latent prediction architectures
