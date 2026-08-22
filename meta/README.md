# Meta corpus

Foundational papers held across all topics. **Quality over quantity** — each entry is S2-verified via `ingest` or `npm run seed:meta`.

## Categories

| Category | Focus |
|----------|--------|
| **foundations** | AI inception → deep learning, RL, transformers, scale |
| **world-models** | Latent dynamics, JEPA, Dreamer, MuZero, planning from models |
| **meta-memory** | External memory, RAG, long context, test-time memory |

## Refresh corpus

```bash
npm run seed:meta
```

Skips papers already in `manifest.json`. Uses title match (not raw arXiv IDs) to avoid wrong-paper collisions.

## Roles

- `foundation` — theory holds and landmark results
- `method` — influential methods (e.g. memory architectures)
