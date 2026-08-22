import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { join } from "node:path";
import {
  metaManifestPath,
  metaPapersDir,
  topicManifestPath,
  topicPapersDir,
  templatesDir,
} from "./paths.js";
import type { CandidatePaper, PaperRecord, PaperRole, S2Paper } from "./types.js";
import { S2Client } from "./s2/client.js";

export type CorpusTarget = "meta" | string;

export function resolveCorpusPath(into: string): { kind: "meta" | "topic"; topicPath?: string } {
  if (into === "meta") {
    return { kind: "meta" };
  }
  if (into.startsWith("topics/")) {
    return { kind: "topic", topicPath: into };
  }
  return { kind: "topic", topicPath: `topics/${into}` };
}

export async function readManifest(path: string): Promise<PaperRecord[]> {
  try {
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw) as PaperRecord[];
  } catch {
    return [];
  }
}

export async function writeManifest(path: string, records: PaperRecord[]): Promise<void> {
  await writeFile(path, JSON.stringify(records, null, 2) + "\n", "utf-8");
}

export function s2ToRecord(
  paper: S2Paper,
  role: PaperRole,
  whyIncluded: string
): PaperRecord {
  return {
    paperId: paper.paperId,
    title: paper.title,
    year: paper.year,
    authors: (paper.authors ?? []).map((a) => a.name),
    venue: paper.venue,
    citationCount: paper.citationCount,
    externalIds: paper.externalIds ?? {},
    url: paper.url,
    abstract: paper.abstract,
    tldr: paper.tldr?.text,
    openAccessPdfUrl: paper.openAccessPdf?.url,
    role,
    whyIncluded,
    quotes: [],
    ingestedAt: new Date().toISOString(),
  };
}

export function toCandidate(paper: S2Paper): CandidatePaper {
  return {
    paperId: paper.paperId,
    title: paper.title,
    year: paper.year,
    authors: (paper.authors ?? []).map((a) => a.name),
    venue: paper.venue,
    citationCount: paper.citationCount,
    url: paper.url,
    abstract: paper.abstract?.slice(0, 500),
  };
}

export async function ingestPaper(
  client: S2Client,
  paperId: string,
  into: string,
  role: PaperRole,
  whyIncluded: string
): Promise<PaperRecord> {
  const paper = await client.getPaper(paperId);
  return await persistPaper(paper, into, role, whyIncluded);
}

export async function ingestPaperData(
  paper: S2Paper,
  into: string,
  role: PaperRole,
  whyIncluded: string
): Promise<PaperRecord> {
  return await persistPaper(paper, into, role, whyIncluded);
}

async function persistPaper(
  paper: S2Paper,
  into: string,
  role: PaperRole,
  whyIncluded: string
): Promise<PaperRecord> {
  const corpus = resolveCorpusPath(into);
  const record = s2ToRecord(paper, role, whyIncluded);

  let manifestPath: string;
  let papersDir: string;

  if (corpus.kind === "meta") {
    manifestPath = metaManifestPath();
    papersDir = metaPapersDir();
  } else {
    manifestPath = topicManifestPath(corpus.topicPath!);
    papersDir = topicPapersDir(corpus.topicPath!);
  }

  const manifest = await readManifest(manifestPath);
  const existing = manifest.findIndex((p) => p.paperId === record.paperId);
  if (existing >= 0) {
    manifest[existing] = { ...manifest[existing], ...record };
  } else {
    manifest.push(record);
  }
  await writeManifest(manifestPath, manifest);

  const paperDir = join(papersDir, record.paperId);
  await mkdir(paperDir, { recursive: true });

  const notesTemplate = await readTemplate("paper-notes.md");
  const notesPath = join(paperDir, "notes.md");
  try {
    await access(notesPath);
  } catch {
    await writeFile(notesPath, notesTemplate, "utf-8");
  }

  await writeFile(join(paperDir, "meta.json"), JSON.stringify(record, null, 2) + "\n", "utf-8");

  return record;
}

export async function loadAllCorpusIds(topicPath: string): Promise<Map<string, PaperRecord>> {
  const map = new Map<string, PaperRecord>();

  const meta = await readManifest(metaManifestPath());
  for (const p of meta) {
    map.set(p.paperId, p);
  }

  const topicManifest = await readManifest(topicManifestPath(topicPath));
  for (const p of topicManifest) {
    map.set(p.paperId, p);
  }

  return map;
}

export async function loadTopicAndMetaRecords(topicPath: string): Promise<{
  meta: PaperRecord[];
  topic: PaperRecord[];
}> {
  return {
    meta: await readManifest(metaManifestPath()),
    topic: await readManifest(topicManifestPath(topicPath)),
  };
}

export async function initTopic(topicPath: string): Promise<void> {
  const dir = topicPath.startsWith("topics/") ? topicPath : `topics/${topicPath}`;
  const { topicDir } = await import("./paths.js");
  const root = topicDir(dir);

  const subdirs = [
    "papers",
    "graph",
    "knowledge",
    "notebooks",
    "results",
    "matrix",
    "refs",
    "draft/sections",
    "latex",
  ];

  for (const sub of subdirs) {
    await mkdir(join(root, sub), { recursive: true });
  }

  await writeManifest(join(root, "papers", "manifest.json"), []);

  const graphTemplate = await readTemplate("graph.json");
  await writeFile(join(root, "graph", "graph.json"), graphTemplate, "utf-8");

  const problemTemplate = await readTemplate("PROBLEM.md");
  await writeFile(join(root, "PROBLEM.md"), problemTemplate, "utf-8");

  const gapTemplate = await readTemplate("GAP.md");
  await writeFile(join(root, "GAP.md"), gapTemplate, "utf-8");

  const outline = `# Draft outline\n\n1. Introduction\n2. Background\n3. Problem and gap\n4. Related work\n5. Approach\n6. Discussion\n7. Conclusion\n`;
  await writeFile(join(root, "draft", "outline.md"), outline, "utf-8");

  const intro = `# Introduction\n\nWrite here. Cite only ingested papers, e.g. [@s2:PAPERID].\n`;
  await writeFile(join(root, "draft", "sections", "introduction.md"), intro, "utf-8");

  const litMatrixHeader = await readTemplate("lit-matrix.csv");
  await writeFile(join(root, "matrix", "lit-review.csv"), litMatrixHeader, "utf-8");

  const articleTemplate = await readTemplate("article.tex");
  await writeFile(join(root, "latex", "main.tex"), articleTemplate, "utf-8");

  const makefile = `all:\n\tlatexmk -pdf main.tex\n\nclean:\n\tlatexmk -c\n`;
  await writeFile(join(root, "latex", "Makefile"), makefile, "utf-8");
}

async function readTemplate(name: string): Promise<string> {
  return readFile(join(templatesDir(), name), "utf-8");
}
