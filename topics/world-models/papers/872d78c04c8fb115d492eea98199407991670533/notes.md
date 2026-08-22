# Paper notes — V-JEPA

## Summary

Feature prediction objective on **video** without pretrained image encoders, text, negatives, or reconstruction. V-JEPA models trained on 2M videos; frozen backbone strong on video and image tasks.

## Key claims

- Video feature prediction learns motion + appearance without generative decoding
- ViT-H/16 video-only: 81.9% K400, 72.2% SSv2, 77.9% ImageNet (frozen)

## Methods / equations

- Spatiotemporal masking; predict target tube representations from context tubes
- Stand-alone objective—no auxiliary contrastive or generative losses required

## Relevance to our problem/gap

- Extends **selective prediction** to temporal world modeling—closer to “intuition” over raw pixels
- Still evaluates representation quality, not compositional recombination at matched FLOPs

## Limitations

- Downstream benchmarks are standard classification/action—not systematic compositional splits
