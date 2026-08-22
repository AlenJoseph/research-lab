import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { topicDir } from "./paths.js";
import { loadTopicAndMetaRecords } from "./corpus.js";

const AI_VENUES = new Set([
  "NeurIPS",
  "ICML",
  "ICLR",
  "AAAI",
  "Journal of Machine Learning Research",
  "Nature",
  "Science",
  "Transactions on Machine Learning Research",
  "IEEE Transactions on Pattern Analysis and Machine Intelligence",
  "Artificial Intelligence",
  "CoRR",
  "arXiv.org",
]);

interface VenueScore {
  venue: string;
  count: number;
  avgCitations: number;
  score: number;
  rationale: string;
}

export async function evaluateJournals(topicPath: string): Promise<void> {
  const { meta, topic } = await loadTopicAndMetaRecords(topicPath);
  const all = [...meta, ...topic];

  const byVenue = new Map<string, { count: number; citations: number[] }>();

  for (const p of all) {
    const venue = (p.venue?.trim() || "Unknown venue").trim();
    const entry = byVenue.get(venue) ?? { count: 0, citations: [] };
    entry.count++;
    if (p.citationCount) entry.citations.push(p.citationCount);
    byVenue.set(venue, entry);
  }

  const scores: VenueScore[] = [];

  for (const [venue, data] of byVenue) {
    const avg =
      data.citations.length > 0
        ? data.citations.reduce((a, b) => a + b, 0) / data.citations.length
        : 0;
    const inCorpus = data.count;
    const aiFit = AI_VENUES.has(venue) || venue.toLowerCase().includes("learning");
    const score = inCorpus * 2 + avg / 100 + (aiFit ? 3 : 0);

    scores.push({
      venue,
      count: data.count,
      avgCitations: Math.round(avg),
      score,
      rationale: aiFit
        ? "Appears in corpus and aligns with ML/AI venues; verify scope and impact factor manually."
        : "Present in corpus; verify fit for your contribution type.",
    });
  }

  scores.sort((a, b) => b.score - a.score);

  const lines = [
    "# Journal / venue fit (heuristic)",
    "",
    "Human verification required — no impact factors claimed.",
    "",
    "| Venue | Papers in corpus | Avg citations | Notes |",
    "|-------|------------------|---------------|-------|",
    ...scores.map(
      (s) =>
        `| ${s.venue.replace(/\|/g, "\\|")} | ${s.count} | ${s.avgCitations} | ${s.rationale} |`
    ),
    "",
    "## Suggested directions",
    "",
    ...scores.slice(0, 5).map(
      (s, i) =>
        `${i + 1}. **${s.venue}** — ${s.count} paper(s) in corpus; ${s.rationale}`
    ),
    "",
  ];

  const base = topicDir(topicPath);
  await writeFile(join(base, "results", "journal-fit.md"), lines.join("\n"), "utf-8");
  console.log(lines.join("\n"));
}
