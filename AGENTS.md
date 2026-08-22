# Research Lab

Git-friendly, **Cursor-native** PhD research pipeline. You talk to the agent; it reads/writes markdown and runs batched Semantic Scholar / Zotero work via the internal runner.

No CLI for humans. No graph database — relations live in `graph.json`.

## Anti-hallucination rules

1. **No cite unless the paper is in `meta/papers/manifest.json` or `topics/<topic>/papers/manifest.json`.**
2. Summaries and comparisons must come from `meta.json`, `notes.md`, and ingested abstracts only.
3. Do not invent titles, DOIs, or paper IDs.
4. Discover / expand / survey harvest produce **candidates** — only ingest / survey promote adds to the corpus.
5. Graph nodes must exist in manifests; curated `graph link` requires a short `note`.

## How to work (chat recipes)

Open this folder in Cursor and ask naturally. The agent follows [`.cursor/skills/research-lab/SKILL.md`](.cursor/skills/research-lab/SKILL.md).

### Start a new topic

Ask: *"Initialize a topic called my-topic"*

Agent scaffolds `topics/my-topic/` from templates (PROBLEM.md, GAP.md, papers/, graph/, survey/, draft/, latex/).

### Discover and ingest papers

Ask: *"Search Semantic Scholar for latent reasoning in language models and ingest the top 3 into world-models"*

Agent runs the internal runner for S2 search + ingest, writes notes, syncs Zotero.

### Literature survey (100–500 papers)

Ask: *"Harvest the world-models survey to 300 papers and analyze coverage"*

Pipeline:
1. `survey/` — edit `SCOPE.md`, `queries.txt`
2. Survey harvest → `catalog.json`
3. Survey analyze → `COVERAGE-MATRIX.md`, `THEMES.md`, `ALREADY-SOLVED.md`
4. Review via canvas (agent writes a visual summary)

### PhD literature-first path (world-models)

1. Survey harvest + analyze
2. Write `GAP-ANALYSIS.md` → `LITERATURE-REVIEW.md` → `PROFESSOR-BRIEF.md`
3. Survey promote → core corpus (25–40 papers) + notes
4. **After professor sign-off:** `HYPOTHESIS.md`, `EXPERIMENT-PLAN.md`

### Graph relations (JSON, not Neo4j)

Ask: *"Sync the graph for world-models and link paper X extends paper Y"*

- Auto edges: `cites`, `cited_by` (S2, corpus papers only)
- Curated: `extends`, `contrasts`, `uses_method`, `builds_on`, `related`
- Viz: `relations.md` + `relations.html` in `graph/`

### Outputs

Ask: *"Build the matrix, bib, and latex for world-models"*

Agent runs matrix → bib → latex internally.

### Zotero

Ask: *"Sync world-models papers to Zotero"*

Requires `ZOTERO_API_KEY` in `.env`. Creates/reuses collection `research-lab/<topic>`.

## Internal runner (agent-only)

The agent invokes batched work — you do not type these:

```bash
npm install
npm run run -- ingest <paperId> --into topics/world-models --role topic --why "..."
npm run run -- survey harvest topics/world-models --target 300 --expand
npm run run -- graph sync topics/world-models
npm run run -- zotero sync topics/world-models
```

One-time bootstrap: `npm run seed:meta` (curated foundations corpus).

## API keys

Copy `.env.example` → `.env`:

- `SEMANTIC_SCHOLAR_API_KEY` — [request here](https://www.semanticscholar.org/product/api#api-key-form); 1 req/s with key
- `ZOTERO_API_KEY` — [create here](https://www.zotero.org/settings/keys/new); needs library write access

Never commit `.env`.

## Folder map

| Path | Purpose |
|------|---------|
| `meta/papers/` | Theory holds (cross-topic) |
| `topics/<name>/survey/` | Survey catalog (`catalog.json`, coverage reports) |
| `topics/<name>/papers/` | Topic corpus (core, deep-read) |
| `topics/<name>/graph/` | `graph.json`, `relations.md`, `relations.html` |
| `topics/<name>/knowledge/` | Equations, concepts |
| `topics/<name>/notebooks/` | Python experiments |
| `topics/<name>/results/` | Findings, journal fit |
| `topics/<name>/matrix/` | Lit review matrix |
| `topics/<name>/draft/` | Markdown sections |
| `topics/<name>/latex/` | LaTeX output |
| `src/` | TypeScript library (S2, graph, survey, zotero) |
| `.cursor/skills/research-lab/` | Agent skill + internal runner |

## Graph edge types

- **S2 (auto):** `cites`, `cited_by` (among corpus papers only)
- **Curated:** `extends`, `contrasts`, `uses_method`, `builds_on`, `related`
