import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { topicSurveyDir } from "../paths.js";
import { loadCatalog } from "./store.js";

const THEME_KEYWORDS: Record<string, string[]> = {
  worldModels: ["world model", "dreamer", "latent dynamics", "imagination", "plann"],
  jepa: ["jepa", "joint-embedding", "predictive architecture", "feature prediction"],
  memory: ["memory", "long context", "retrieval", "memor", "titans", "ntm", "dnc"],
  scaling: ["scaling", "trillion", "compute-optimal", "chinchilla", "autoregressive"],
  composition: ["compositional", "composition", "systematic generalization"],
  language: [
    "language model",
    "semantic parsing",
    "natural language",
    "text reasoning",
    "nlp",
    "scan",
    "cfq",
    "cogs",
    "token generation",
    "chain-of-thought",
    "chain of thought",
  ],
  latentReasoning: [
    "latent reasoning",
    "jepa-reasoner",
    "decouple",
    "non-autoregressive language",
    "latent-space reasoning",
  ],
  rl: ["reinforcement", "sample efficiency", "mbrl", "model-based"],
  predictive: ["predictive coding", "prediction error", "self-supervised"],
};

function matchThemes(text: string): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) hits.push(theme);
  }
  return hits;
}

export async function generateCoverageReports(topicPath: string): Promise<void> {
  const catalog = await loadCatalog(topicPath);
  const dir = topicSurveyDir(topicPath);

  const tagCounts = new Map<string, number>();
  const themeCounts = new Map<string, number>();

  for (const e of catalog.entries) {
    for (const t of e.queryTags) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }
    const blob = `${e.title} ${e.abstract ?? ""}`;
    for (const theme of matchThemes(blob)) {
      themeCounts.set(theme, (themeCounts.get(theme) ?? 0) + 1);
    }
  }

  const coverageLines = [
    "# Coverage matrix",
    "",
    `Generated from survey catalog (${catalog.entries.length} papers).`,
    "",
    "## By search query tag",
    "",
    "| Query tag | Papers (overlap possible) |",
    "|-----------|---------------------------|",
    ...[...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([t, c]) => `| ${t.replace(/\|/g, "\\|")} | ${c} |`),
    "",
    "## By thematic keywords (title + abstract)",
    "",
    "| Theme | Papers |",
    "|-------|--------|",
    ...[...themeCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([t, c]) => `| ${t} | ${c} |`),
    "",
  ];

  const themesLines = [
    "# Thematic clusters",
    "",
    "Auto-clustered from keywords in survey catalog. Refine manually after reading top papers per theme.",
    "",
    ...Object.keys(THEME_KEYWORDS).map((theme) => {
      const count = themeCounts.get(theme) ?? 0;
      const examples = catalog.entries
        .filter((e) => matchThemes(`${e.title} ${e.abstract ?? ""}`).includes(theme))
        .sort((a, b) => (b.citationCount ?? 0) - (a.citationCount ?? 0))
        .slice(0, 8)
        .map((e) => `- [@s2:${e.paperId}] ${e.title} (${e.year ?? "?"})`);
      return `## ${theme} (${count} papers)\n\n${examples.join("\n")}\n`;
    }),
  ];

  const solvedLines = [
    "# What the field already shows",
    "",
    "Draft from catalog themes—verify against papers before claiming in proposal.",
    "",
    "### World models & latent imagination",
    `- ${themeCounts.get("worldModels") ?? 0} catalog papers mention world models / Dreamer / latent planning.`,
    "- Core line: learn compressed dynamics; plan in latent space (Ha, DreamerV3, PlaNet in meta corpus).",
    "",
    "### Selective / non-generative prediction (JEPA)",
    `- ${themeCounts.get("jepa") ?? 0} papers tagged JEPA / feature prediction.`,
    "- I-JEPA and V-JEPA show strong representation learning without pixel reconstruction.",
    "",
    "### Memory beyond fixed attention",
    `- ${themeCounts.get("memory") ?? 0} papers on memory, retrieval, long context.`,
    "- NTM, DNC, RAG, Titans, MemGPT lines—partial solutions to exhaustive context.",
    "",
    "### Scale-only path",
    `- ${themeCounts.get("scaling") ?? 0} papers on scaling / compute-optimal training.`,
    "- Contrast baseline: bigger AR models vs structured prediction.",
    "",
    "### Compositional generalization",
    `- ${themeCounts.get("composition") ?? 0} papers mention compositional / systematic generalization.`,
    "",
    "### Language / text reasoning",
    `- ${themeCounts.get("language") ?? 0} papers on language models, semantic parsing, NLP reasoning.`,
  ];
  if ((themeCounts.get("latentReasoning") ?? 0) > 0) {
    solvedLines.push(
      "",
      "### Latent reasoning (non-token exhaust)",
      `- ${themeCounts.get("latentReasoning") ?? 0} papers on latent reasoning / decoupled from token generation.`,
      "- JEPA-Reasoner and related: reason in embedding space vs chain-of-thought tokens.",
      ""
    );
  }
  solvedLines.push(
    "### Likely crowded (avoid claiming gap without nuance)",
    "- Pure \"world model for RL\" without new eval axis",
    "- Generic JEPA image SSL without intuition/composition hook",
    "- RAG for long context without predictive state",
    "",
  );

  await writeFile(join(dir, "COVERAGE-MATRIX.md"), coverageLines.join("\n"), "utf-8");
  await writeFile(join(dir, "THEMES.md"), themesLines.join("\n"), "utf-8");
  await writeFile(join(dir, "ALREADY-SOLVED.md"), solvedLines.join("\n"), "utf-8");
  console.log(`Wrote COVERAGE-MATRIX.md, THEMES.md, ALREADY-SOLVED.md`);
}
