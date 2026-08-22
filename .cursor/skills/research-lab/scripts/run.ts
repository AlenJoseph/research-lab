/**
 * Internal runner invoked by the Cursor agent — not a user-facing CLI.
 * Usage: npx tsx .cursor/skills/research-lab/scripts/run.ts <command> [args...]
 */
import { writeFile } from "node:fs/promises";
import { loadEnv } from "../../../../src/env.js";
import { ingestPaper, initTopic, toCandidate } from "../../../../src/corpus.js";
import { S2Client } from "../../../../src/s2/client.js";
import { buildBib } from "../../../../src/bib.js";
import { buildMatrix } from "../../../../src/matrix.js";
import { evaluateJournals } from "../../../../src/journals.js";
import { buildLatex } from "../../../../src/latex.js";
import {
  CURATED_EDGE_TYPES,
  loadGraph,
  saveGraph,
  upsertEdge,
  validateGraph,
  ensureNodesFromCorpus,
} from "../../../../src/graph/store.js";
import { syncGraph } from "../../../../src/graph/sync.js";
import { writeVisualizations } from "../../../../src/graph/viz.js";
import type { EdgeType } from "../../../../src/types.js";
import { harvestSurvey, printSurveyStatus } from "../../../../src/survey/harvest.js";
import { generateCoverageReports } from "../../../../src/survey/analyze.js";
import { promoteToCore } from "../../../../src/survey/promote.js";
import { getZoteroStatus, syncTopicToZotero } from "../../../../src/zotero/sync.js";

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[key] = next;
        i++;
      } else {
        out[key] = "true";
      }
    }
  }
  return out;
}

function normalizeTopicPath(p: string): string {
  if (p.startsWith("topics/")) return p;
  return `topics/${p}`;
}

function usage(): void {
  console.log(`
research-lab runner (agent-only)

  problem init <topicPath>
  discover <query> [--limit N] [--out file]
  ingest <paperId> --into meta|topics/... --role foundation|topic|method|critique --why "..."
  expand <paperId> --mode citations|references [--limit N] [--out file]
  graph sync <topicPath>
  graph link <topicPath> --from ID --to ID --type TYPE --note "..."
  graph viz <topicPath>
  survey harvest <topicPath> [--target N] [--queries file] [--expand]
  survey status <topicPath>
  survey analyze <topicPath>
  survey promote <paperId> --role topic|method|... --why "..." [--topic path]
  matrix <topicPath>
  bib <topicPath>
  journals <topicPath>
  latex <topicPath>
  zotero status [--topic path]
  zotero sync <topicPath>
`);
}

async function main(): Promise<void> {
  loadEnv();
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    usage();
    process.exit(1);
  }

  const cmd = argv[0];
  const flags = parseArgs(argv.slice(1));
  const positional = argv.slice(1).filter((a) => !a.startsWith("--") && !Object.values(flags).includes(a));

  const client = new S2Client();
  if (client.isAuthenticated()) {
    console.log("Semantic Scholar: using API key (1 req/s throttle)");
  }

  if (cmd === "problem" && positional[0] === "init") {
    const raw = positional[1] ?? "world-models";
    const topicPath = raw.startsWith("topics/") ? raw : `topics/${raw}`;
    await initTopic(topicPath);
    console.log(`Initialized ${topicPath}`);
    return;
  }

  if (cmd === "discover") {
    const query = positional[0];
    if (!query) throw new Error("discover requires a query");
    const limit = parseInt(flags.limit ?? "15", 10);
    const papers = await client.searchPapers(query, limit);
    const candidates = papers.map(toCandidate);
    const out = flags.out ?? "candidates.json";
    await writeFile(out, JSON.stringify(candidates, null, 2) + "\n", "utf-8");
    console.log(`Wrote ${candidates.length} candidates to ${out}`);
    return;
  }

  if (cmd === "ingest") {
    const paperId = positional[0];
    const into = flags.into;
    const role = (flags.role ?? "topic") as "foundation" | "topic" | "method" | "critique";
    const why = flags.why ?? "Included in corpus";
    if (!paperId || !into) throw new Error("ingest requires paperId and --into");
    const record = await ingestPaper(client, paperId, into, role, why);
    console.log(`Ingested: ${record.title} (${record.paperId})`);
    return;
  }

  if (cmd === "expand") {
    const paperId = positional[0];
    const mode = flags.mode ?? "citations";
    const limit = parseInt(flags.limit ?? "10", 10);
    if (!paperId) throw new Error("expand requires paperId");

    let candidates;
    if (mode === "references") {
      const refs = await client.getReferences(paperId, limit);
      candidates = refs.map((r) => toCandidate(r.citedPaper));
    } else {
      const cites = await client.getCitations(paperId, limit);
      candidates = cites.map((c) => toCandidate(c.citingPaper));
    }

    const out = flags.out ?? "candidates.json";
    await writeFile(out, JSON.stringify(candidates, null, 2) + "\n", "utf-8");
    console.log(`Wrote ${candidates.length} candidates to ${out}`);
    return;
  }

  if (cmd === "graph") {
    const sub = positional[0];
    const topicPath = normalizeTopicPath(positional[1]);

    if (sub === "sync") {
      const { edgesAdded } = await syncGraph(topicPath);
      console.log(`Graph sync complete. Edges touched: ${edgesAdded}`);
      return;
    }

    if (sub === "link") {
      const from = flags.from;
      const to = flags.to;
      const type = flags.type as EdgeType;
      const note = flags.note;
      if (!from || !to || !type || !note) {
        throw new Error("graph link requires --from --to --type --note");
      }
      if (!CURATED_EDGE_TYPES.includes(type)) {
        throw new Error(`type must be one of: ${CURATED_EDGE_TYPES.join(", ")}`);
      }

      let graph = await loadGraph(topicPath);
      graph = await ensureNodesFromCorpus(topicPath, graph);
      upsertEdge(graph, from, to, type, "curated", note);
      graph = await validateGraph(topicPath, graph);
      await saveGraph(topicPath, graph);
      console.log(`Linked ${from} -> ${to} (${type})`);
      return;
    }

    if (sub === "viz") {
      await writeVisualizations(topicPath);
      console.log(`Wrote relations.md and relations.html under ${topicPath}/graph/`);
      return;
    }

    throw new Error("graph subcommand: sync | link | viz");
  }

  if (cmd === "survey") {
    const sub = positional[0];

    if (sub === "promote") {
      const paperId = positional[1];
      const topicPath = normalizeTopicPath(flags.topic ?? positional[2] ?? "world-models");
      const role = (flags.role ?? "topic") as "foundation" | "topic" | "method" | "critique";
      const why = flags.why ?? "Promoted from survey to core corpus";
      if (!paperId) throw new Error("survey promote requires paperId");
      await promoteToCore(client, topicPath, paperId, role, why);
      return;
    }

    const topicPath = normalizeTopicPath(positional[1] ?? "world-models");

    if (sub === "harvest") {
      const target = parseInt(flags.target ?? "300", 10);
      const queriesFile = flags.queries;
      const result = await harvestSurvey(client, topicPath, {
        target,
        queriesFile,
        expandSeeds: process.argv.includes("--expand"),
      });
      console.log(`Harvest complete. Added ${result.added}, total ${result.total}`);
      return;
    }

    if (sub === "status") {
      await printSurveyStatus(topicPath);
      return;
    }

    if (sub === "analyze") {
      await generateCoverageReports(topicPath);
      return;
    }

    throw new Error("survey subcommand: harvest | status | analyze | promote");
  }

  if (cmd === "matrix") {
    const topicPath = normalizeTopicPath(positional[0] ?? "world-models");
    await buildMatrix(topicPath);
    console.log(`Matrix written for ${topicPath}`);
    return;
  }

  if (cmd === "bib") {
    const topicPath = normalizeTopicPath(positional[0] ?? "world-models");
    await buildBib(topicPath);
    console.log(`BibTeX written for ${topicPath}`);
    return;
  }

  if (cmd === "journals") {
    const topicPath = normalizeTopicPath(positional[0] ?? "world-models");
    await evaluateJournals(topicPath);
    return;
  }

  if (cmd === "latex") {
    const topicPath = normalizeTopicPath(positional[0] ?? "world-models");
    await buildLatex(topicPath);
    return;
  }

  if (cmd === "zotero") {
    const sub = positional[0];

    if (sub === "status") {
      const topicPath = flags.topic ? normalizeTopicPath(flags.topic) : undefined;
      const status = await getZoteroStatus(topicPath);
      console.log(JSON.stringify(status, null, 2));
      return;
    }

    if (sub === "sync") {
      const topicPath = normalizeTopicPath(positional[1] ?? "world-models");
      const result = await syncTopicToZotero(topicPath);
      console.log(
        `Zotero sync: ${result.synced} added, ${result.skipped} skipped → ${result.collectionName}`
      );
      return;
    }

    throw new Error("zotero subcommand: status | sync");
  }

  usage();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
