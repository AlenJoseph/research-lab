import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { topicDir } from "./paths.js";
import { loadTopicAndMetaRecords } from "./corpus.js";
import type { PaperRecord } from "./types.js";

function csvEscape(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function buildMatrix(topicPath: string): Promise<void> {
  const { meta, topic } = await loadTopicAndMetaRecords(topicPath);
  const all: PaperRecord[] = [
    ...meta.map((p) => ({ ...p, role: p.role })),
    ...topic,
  ];

  const seen = new Set<string>();
  const unique: PaperRecord[] = [];
  for (const p of all) {
    if (seen.has(p.paperId)) continue;
    seen.add(p.paperId);
    unique.push(p);
  }

  const headers = [
    "paperId",
    "title",
    "year",
    "authors",
    "venue",
    "citationCount",
    "role",
    "source",
    "whyIncluded",
    "keyClaim",
    "gapRelevance",
    "limitations",
  ];

  const rows = unique.map((p) => {
    const source = meta.some((m) => m.paperId === p.paperId) ? "meta" : "topic";
    return [
      p.paperId,
      p.title,
      String(p.year ?? ""),
      p.authors.join("; "),
      p.venue ?? "",
      String(p.citationCount ?? ""),
      p.role,
      source,
      p.whyIncluded,
      "",
      "",
      "",
    ].map(csvEscape).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n") + "\n";
  const base = topicDir(topicPath);

  await writeFile(join(base, "matrix", "lit-review.csv"), csv, "utf-8");

  const mdLines = [
    "# Literature review matrix",
    "",
    "| Title | Year | Role | Source | Why included |",
    "|-------|------|------|--------|--------------|",
    ...unique.map(
      (p) => {
        const source = meta.some((m) => m.paperId === p.paperId) ? "meta" : "topic";
        const title = p.title.replace(/\|/g, "\\|");
        const why = p.whyIncluded.replace(/\|/g, "\\|");
        return `| ${title} | ${p.year ?? ""} | ${p.role} | ${source} | ${why} |`;
      }
    ),
    "",
  ];

  await writeFile(join(base, "matrix", "lit-review.md"), mdLines.join("\n"), "utf-8");
}
