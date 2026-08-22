---
name: research-lab
description: >-
  Operates the research-lab PhD pipeline: Semantic Scholar discovery, paper
  ingest, survey harvest, JSON graph relations, Zotero sync, matrix/bib/latex.
  Use when working in research-lab, doing literature review, ingesting papers,
  syncing Zotero, building coverage matrices, graph links, or reviewing survey
  health for a topic.
---

# Research Lab (Cursor-native)

You operate this lab. The user talks in chat; you read/write files and run the internal runner for batched API work.

**Always read [AGENTS.md](../../AGENTS.md) first** before editing research content.

## What you do directly vs via runner

| Task | How |
|------|-----|
| PROBLEM.md, GAP.md, notes, drafts | Write markdown files directly |
| Discover / ingest / survey harvest | Run internal runner (rate-limited S2) |
| Graph sync / link / viz | Run internal runner |
| Matrix / bib / journals / latex | Run internal runner |
| Zotero sync | Run internal runner after ingest batches |
| Survey / coverage review | Write a canvas (see below) |

## Internal runner

From repo root:

```bash
npm run run -- <command> [args]
```

Examples the agent runs (user never types these):

```bash
npm run run -- discover "latent reasoning language model" --limit 15 --out /tmp/candidates.json
npm run run -- ingest ae20731997793ef95dc8a1684f5897050626af87 --into topics/world-models --role topic --why "JEPA-Reasoner baseline"
npm run run -- survey harvest topics/world-models --target 300 --expand
npm run run -- survey analyze topics/world-models
npm run run -- survey promote PAPERID --role topic --why "core for gap" --topic world-models
npm run run -- graph sync topics/world-models
npm run run -- graph link topics/world-models --from ID --to ID --type extends --note "..."
npm run run -- graph viz topics/world-models
npm run run -- matrix topics/world-models
npm run run -- bib topics/world-models
npm run run -- zotero sync topics/world-models
npm run run -- zotero status --topic world-models
```

Requires `.env` with `SEMANTIC_SCHOLAR_API_KEY` and optionally `ZOTERO_API_KEY`.

## Anti-hallucination (mandatory)

1. Cite only papers in `meta/papers/manifest.json` or `topics/<topic>/papers/manifest.json` as `[@s2:PAPERID]`.
2. Summaries from `meta.json`, `notes.md`, ingested abstracts only — never invent titles/DOIs/IDs.
3. Discover/expand/survey harvest produce **candidates**; only ingest/promote adds to corpus.
4. Graph nodes must exist in manifests; curated edges need a short `note`.
5. No Neo4j — graph is `topics/<topic>/graph/graph.json` (git-friendly JSON).

## Typical chat workflows

**"Ingest JEPA-Reasoner into world-models"**
1. `npm run run -- ingest <paperId> --into topics/world-models --role topic --why "..."`
2. Write/update `topics/world-models/papers/<id>/notes.md`
3. `npm run run -- zotero sync topics/world-models`

**"Harvest survey for world-models"**
1. Check `topics/world-models/survey/queries.txt`
2. `npm run run -- survey harvest topics/world-models --target 300 --expand`
3. `npm run run -- survey analyze topics/world-models`
4. Offer canvas review of COVERAGE-MATRIX

**"Sync graph and show relations"**
1. `npm run run -- graph sync topics/world-models`
2. Add curated links if user specifies relationships
3. `npm run run -- graph viz topics/world-models`

**"Prepare draft outputs"**
1. `npm run run -- matrix topics/world-models`
2. `npm run run -- bib topics/world-models`
3. `npm run run -- latex topics/world-models`

## Survey / coverage canvas

When the user asks to review survey health, coverage, gap, or corpus status for a topic:

1. Read `topics/<topic>/survey/COVERAGE-MATRIX.md`, `catalog.json`, `papers/manifest.json`, `graph/graph.json`
2. Write a `.canvas.tsx` to the workspace canvases directory (see canvas skill)
3. Use `Stat`, `BarChart`, `Table` from `cursor/canvas` with embedded data
4. Include query-tag counts, theme counts, core corpus by role, graph edge types

Do not add a CLI for canvas — it is an IDE artifact.

## Folder map

| Path | Purpose |
|------|---------|
| `meta/papers/` | Cross-topic foundations |
| `topics/<name>/survey/` | Survey catalog + coverage reports |
| `topics/<name>/papers/` | Core corpus |
| `topics/<name>/graph/` | `graph.json`, `relations.md/html` |
| `topics/<name>/knowledge/` | Concepts, equations |
| `topics/<name>/matrix/` | Lit review matrix |
| `topics/<name>/draft/` | Markdown sections |
| `topics/<name>/latex/` | LaTeX output |
| `src/` | Library (S2, graph, survey, zotero) — not user-facing |
