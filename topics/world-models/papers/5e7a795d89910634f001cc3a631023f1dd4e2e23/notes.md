# Paper notes — Titans

## Summary

Neural **long-term memory** module that learns to memorize history at test time; attention acts as short-term memory. Three Titans variants for incorporating memory into architecture.

## Key claims

- Outperforms Transformers and modern linear RNNs on language, genomics, time series
- Scales to **>2M context** with strong needle-in-haystack vs baselines
- Memory = persistent long-term; attention = accurate short-term dependency modeling

## Methods / equations

- Fast parallelizable training; memory updated during inference
- Positions as alternative to quadratic attention over full history

## Relevance to our problem/gap

- **Non-exhaustive context:** attend via learned memory rather than full sequence
- Gap: not combined with JEPA compositional vision eval; memory vs retrieval (RAG) not FLOPs-matched

## Limitations

- Sequence domains; integration with JEPA/world-model compositional benchmarks open
