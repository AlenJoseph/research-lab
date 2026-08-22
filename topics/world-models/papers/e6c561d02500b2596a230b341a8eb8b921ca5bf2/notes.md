# Paper notes — Scaling Laws

## Summary

Empirical power laws for LM loss vs model size, dataset size, and compute over 7+ orders of magnitude.

## Key claims

- Larger models are **more sample-efficient** in compute-optimal training
- Optimal allocation: train very large models on modest data, early stopping

## Relevance to our problem/gap

- Defines **industrial default** our structured approach contrasts against
- Does not consider JEPA/world-model **inference FLOPs** on compositional tasks

## Limitations

- AR language modeling; extrapolation to predictive world models untested in this paper
