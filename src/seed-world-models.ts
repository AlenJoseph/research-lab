import { loadEnv } from "./env.js";
import { S2Client } from "./s2/client.js";
import { ingestPaper, ingestPaperData } from "./corpus.js";

const META = [
  {
    title: "A Path Towards Autonomous Machine Intelligence",
    role: "foundation" as const,
    why: "LeCun world model and JEPA architecture thesis",
  },
];

const TOPIC = [
  {
    title: "Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture",
    role: "topic" as const,
    why: "I-JEPA image world model baseline",
  },
  {
    title: "Revisiting Feature Prediction for Learning Visual Representations from Video",
    role: "topic" as const,
    why: "V-JEPA video world model",
  },
  {
    title: "Titans: Learning to Memorize at Test Time",
    role: "topic" as const,
    why: "Meta-memory / long-term memory for sequence models",
  },
];

async function ingestByTitle(
  client: S2Client,
  title: string,
  into: string,
  role: "foundation" | "topic" | "method" | "critique",
  why: string
): Promise<void> {
  const match = await client.matchPaperByTitle(title);
  if (!match) {
    console.warn(`No match for title: ${title}`);
    return;
  }
  console.log(`Matched: ${match.title} (${match.paperId})`);
  const record = await ingestPaperData(match, into, role, why);
  console.log(`Ingested: ${record.title}`);
}

async function main(): Promise<void> {
  loadEnv();
  const client = new S2Client();
  for (const p of META) {
    await ingestByTitle(client, p.title, "meta", p.role, p.why);
  }
  for (const p of TOPIC) {
    await ingestByTitle(client, p.title, "topics/world-models", p.role, p.why);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
