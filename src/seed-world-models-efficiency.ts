/**
 * Topic-specific papers: scale, compute-optimal training, efficiency vs world models.
 */
import { loadEnv } from "./env.js";
import { S2Client } from "./s2/client.js";
import { readManifest, ingestPaperData } from "./corpus.js";
import { topicManifestPath } from "./paths.js";
import type { PaperRole } from "./types.js";

const TOPIC = "topics/world-models";

const PAPERS: Array<{ title?: string; paperId?: string; role: PaperRole; why: string }> = [
  {
    title: "Training Compute-Optimal Large Language Models",
    role: "critique",
    why: "Compute-optimal scaling — data vs parameters (contrast with world-model sample efficiency)",
  },
  {
    title: "Scaling Laws for Neural Language Models",
    role: "foundation",
    why: "Scaling laws baseline for scale-only path",
  },
  {
    title: "Switch Transformers: Scaling to Trillion Parameter Models",
    role: "method",
    why: "Trillion-parameter engineering path vs structured world models",
  },
  {
    title: "On the Opportunities and Risks of Foundation Models",
    role: "critique",
    why: "Deployment cost and societal scale of foundation models",
  },
];

async function main(): Promise<void> {
  loadEnv();
  const client = new S2Client();
  const manifest = await readManifest(topicManifestPath(TOPIC));
  const existing = new Set(manifest.map((p) => p.paperId));

  for (const entry of PAPERS) {
    let paper;
    if (entry.paperId) {
      paper = await client.getPaper(entry.paperId);
    } else if (entry.title) {
      paper = await client.matchPaperByTitle(entry.title);
      if (!paper) {
        console.warn(`No match: ${entry.title}`);
        continue;
      }
    } else continue;

    if (existing.has(paper.paperId)) {
      console.log(`Skip exists: ${paper.title}`);
      continue;
    }
    const r = await ingestPaperData(paper, TOPIC, entry.role, entry.why);
    existing.add(r.paperId);
    console.log(`Ingested: ${r.title}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
