import { readFile } from "node:fs/promises";
import { S2Client } from "../s2/client.js";
import { toCandidate } from "../corpus.js";
import type { CandidatePaper } from "../types.js";
import {
  catalogPaperIds,
  loadCatalog,
  mergeEntry,
  saveCatalog,
} from "./store.js";
import type { SurveyEntry } from "./types.js";
import { surveyQueriesPath } from "../paths.js";

const DEFAULT_SEEDS = [
  "775f42ed458b8c5b0f2094ea4ff5b64c557b1a34",
  "ee57e4d7a125f4ca8916284a857c3760d7d378d3",
  "872d78c04c8fb115d492eea98199407991670533",
  "ff332c21562c87cab5891d495b7d0956f2d9228b",
  "f2d952a183dfb0a1e031b8a3f535d9f8423d7a6e",
  "5e7a795d89910634f001cc3a631023f1dd4e2e23",
];

export async function readQueries(topicPath: string, queriesFile?: string): Promise<string[]> {
  const path = queriesFile ?? surveyQueriesPath(topicPath);
  const raw = await readFile(path, "utf-8");
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}

function candidateToEntry(c: CandidatePaper, tag: string): SurveyEntry {
  return {
    paperId: c.paperId,
    title: c.title,
    year: c.year,
    authors: c.authors,
    venue: c.venue,
    citationCount: c.citationCount,
    url: c.url,
    abstract: c.abstract,
    queryTags: [tag],
    harvestedAt: new Date().toISOString(),
  };
}

export async function harvestSurvey(
  client: S2Client,
  topicPath: string,
  options: {
    target?: number;
    queriesFile?: string;
    perQueryLimit?: number;
    expandSeeds?: boolean;
  } = {}
): Promise<{ added: number; total: number }> {
  const target = options.target ?? 300;
  const perQueryLimit = options.perQueryLimit ?? 100;
  const catalog = await loadCatalog(topicPath);
  const seen = catalogPaperIds(catalog);

  let added = 0;

  const queries = await readQueries(topicPath, options.queriesFile);
  for (const query of queries) {
    if (catalog.entries.length >= target) break;
    console.log(`Query: ${query}`);
    const papers = await client.searchPapers(query, perQueryLimit);
    for (const p of papers) {
      if (seen.has(p.paperId)) {
        mergeEntry(catalog, candidateToEntry(toCandidate(p), query));
        continue;
      }
      mergeEntry(catalog, candidateToEntry(toCandidate(p), query));
      seen.add(p.paperId);
      added++;
      if (catalog.entries.length >= target) break;
    }
    await saveCatalog(catalog);
    console.log(`  Catalog size: ${catalog.entries.length}`);
  }

  if (options.expandSeeds && catalog.entries.length < target) {
    for (const seedId of DEFAULT_SEEDS) {
      if (catalog.entries.length >= target) break;
      console.log(`Expand citations: ${seedId}`);
      try {
        const cites = await client.getCitations(seedId, 50);
        for (const item of cites) {
          const p = item.citingPaper;
          if (!p?.paperId) continue;
          const tag = `expand:citations:${seedId.slice(0, 8)}`;
          if (seen.has(p.paperId)) {
            mergeEntry(catalog, candidateToEntry(toCandidate(p), tag));
            continue;
          }
          mergeEntry(catalog, candidateToEntry(toCandidate(p), tag));
          seen.add(p.paperId);
          added++;
          if (catalog.entries.length >= target) break;
        }
        await saveCatalog(catalog);
      } catch (err) {
        console.warn(`  Expand failed for ${seedId}:`, err);
      }
    }
  }

  await saveCatalog(catalog);
  return { added, total: catalog.entries.length };
}

export async function printSurveyStatus(topicPath: string): Promise<void> {
  const catalog = await loadCatalog(topicPath);
  const byTag = new Map<string, number>();
  for (const e of catalog.entries) {
    for (const t of e.queryTags) {
      byTag.set(t, (byTag.get(t) ?? 0) + 1);
    }
  }
  console.log(`Survey catalog: ${catalog.entries.length} unique papers`);
  console.log(`Updated: ${catalog.updatedAt}`);
  console.log("Query tags (papers per tag, may overlap):");
  for (const [tag, count] of [...byTag.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${count}  ${tag}`);
  }
}
