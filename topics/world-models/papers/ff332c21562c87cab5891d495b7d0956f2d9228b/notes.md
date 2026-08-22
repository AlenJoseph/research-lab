# Paper notes — World Models (Ha & Schmidhuber)

## Summary

Agent learns compact **latent dynamics model** of environment; policy trained on **imagined** rollouts in latent space—reduces real environment interaction.

## Key claims

- World model + controller achieves competitive scores with fewer environment steps (Car Racing)
- VAE latent state captures enough structure for planning in “dreams”

## Methods / equations

- VAE encoder → latent transition model → decoder; imagination training for policy

## Relevance to our problem/gap

- Foundational **latent imagination** vs processing every pixel at decision time
- Evaluated on RL sample efficiency, not compositional generalization or FLOPs vs AR

## Limitations

- Single-domain demo scale; generative decoder path (contrast with JEPA non-generative)
