import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  surveyCatalogCsvPath,
  surveyCatalogPath,
  topicSurveyDir,
} from "../paths.js";
import type { SurveyCatalog, SurveyEntry } from "./types.js";

export async function loadCatalog(topicPath: string): Promise<SurveyCatalog> {
  try {
    const raw = await readFile(surveyCatalogPath(topicPath), "utf-8");
    return JSON.parse(raw) as SurveyCatalog;
  } catch {
    return {
      topicPath,
      updatedAt: new Date().toISOString(),
      entries: [],
    };
  }
}

export async function saveCatalog(catalog: SurveyCatalog): Promise<void> {
  await mkdir(topicSurveyDir(catalog.topicPath), { recursive: true });
  catalog.updatedAt = new Date().toISOString();
  await writeFile(
    surveyCatalogPath(catalog.topicPath),
    JSON.stringify(catalog, null, 2) + "\n",
    "utf-8"
  );
  await writeCatalogCsv(catalog);
}

export function mergeEntry(catalog: SurveyCatalog, entry: SurveyEntry): void {
  const existing = catalog.entries.find((e) => e.paperId === entry.paperId);
  if (existing) {
    for (const tag of entry.queryTags) {
      if (!existing.queryTags.includes(tag)) existing.queryTags.push(tag);
    }
    if (!existing.abstract && entry.abstract) existing.abstract = entry.abstract;
    if (!existing.citationCount && entry.citationCount) {
      existing.citationCount = entry.citationCount;
    }
  } else {
    catalog.entries.push(entry);
  }
}

function csvEscape(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function writeCatalogCsv(catalog: SurveyCatalog): Promise<void> {
  const headers = [
    "paperId",
    "title",
    "year",
    "citationCount",
    "venue",
    "queryTags",
    "abstract",
  ];
  const rows = catalog.entries.map((e) =>
    [
      e.paperId,
      e.title,
      String(e.year ?? ""),
      String(e.citationCount ?? ""),
      e.venue ?? "",
      e.queryTags.join(";"),
      (e.abstract ?? "").slice(0, 500),
    ]
      .map(csvEscape)
      .join(",")
  );
  await writeFile(
    surveyCatalogCsvPath(catalog.topicPath),
    [headers.join(","), ...rows].join("\n") + "\n",
    "utf-8"
  );
}

export function catalogPaperIds(catalog: SurveyCatalog): Set<string> {
  return new Set(catalog.entries.map((e) => e.paperId));
}
