import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { topicDir } from "./paths.js";
import { loadTopicAndMetaRecords } from "./corpus.js";
import type { PaperRecord } from "./types.js";

export function bibKey(paperId: string): string {
  return `s2_${paperId.replace(/[^a-zA-Z0-9]/g, "_")}`;
}

function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return "";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors[0]} and others`;
}

function escapeBib(s: string): string {
  return s.replace(/[{}]/g, "");
}

export function paperToBibtex(p: PaperRecord): string {
  const key = bibKey(p.paperId);
  const doi = p.externalIds.DOI;
  const arxiv = p.externalIds.ArXiv;
  const url = p.url ?? (arxiv ? `https://arxiv.org/abs/${arxiv}` : undefined);

  const lines = [
    `@article{${key},`,
    `  title = {${escapeBib(p.title)}},`,
    `  author = {${escapeBib(formatAuthors(p.authors))}},`,
  ];

  if (p.year) lines.push(`  year = {${p.year}},`);
  if (p.venue) lines.push(`  journal = {${escapeBib(p.venue)}},`);
  if (doi) lines.push(`  doi = {${doi}},`);
  if (arxiv) lines.push(`  eprint = {${arxiv}},`);
  if (arxiv) lines.push(`  archivePrefix = {arXiv},`);
  if (url) lines.push(`  url = {${url}},`);

  lines.push("}");
  return lines.join("\n");
}

export async function buildBib(topicPath: string): Promise<string> {
  const { meta, topic } = await loadTopicAndMetaRecords(topicPath);
  const seen = new Set<string>();
  const entries: string[] = [];

  for (const p of [...meta, ...topic]) {
    if (seen.has(p.paperId)) continue;
    seen.add(p.paperId);
    entries.push(paperToBibtex(p));
  }

  const bib = entries.join("\n\n") + "\n";
  const base = topicDir(topicPath);
  await writeFile(join(base, "refs", "references.bib"), bib, "utf-8");
  await writeFile(join(base, "latex", "references.bib"), bib, "utf-8");
  return bib;
}
