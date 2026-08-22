# Research Lab

Cursor-native PhD research pipeline: Semantic Scholar discovery, git-friendly JSON graph, Zotero sync, LaTeX output.

**Open this folder in Cursor and ask.** The agent reads [AGENTS.md](AGENTS.md) and follows the [research-lab skill](.cursor/skills/research-lab/SKILL.md).

## Setup

```bash
npm install
cp .env.example .env   # add SEMANTIC_SCHOLAR_API_KEY and ZOTERO_API_KEY
```

Optional one-time bootstrap: `npm run seed:meta`

## What you can ask

- *"Ingest JEPA-Reasoner into world-models"*
- *"Harvest the survey and show coverage"*
- *"Sync graph and visualize relations"*
- *"Build matrix, bib, and latex"*
- *"Sync papers to Zotero"*

No CLI to memorize. No Neo4j. Everything is markdown + JSON in git.

## Structure

- `topics/world-models/` — active PhD topic (survey, papers, graph, draft)
- `meta/papers/` — cross-topic foundations
- `templates/` — scaffolds for new topics
- `src/` — library the agent calls (not user-facing)
