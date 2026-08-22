import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, "..");

export function metaPapersDir(): string {
  return join(ROOT, "meta", "papers");
}

export function metaManifestPath(): string {
  return join(metaPapersDir(), "manifest.json");
}

export function topicDir(topicPath: string): string {
  if (topicPath.startsWith("topics/")) {
    return join(ROOT, topicPath);
  }
  return join(ROOT, "topics", topicPath);
}

export function topicPapersDir(topicPath: string): string {
  return join(topicDir(topicPath), "papers");
}

export function topicManifestPath(topicPath: string): string {
  return join(topicPapersDir(topicPath), "manifest.json");
}

export function topicGraphDir(topicPath: string): string {
  return join(topicDir(topicPath), "graph");
}

export function topicGraphPath(topicPath: string): string {
  return join(topicGraphDir(topicPath), "graph.json");
}

export function templatesDir(): string {
  return join(ROOT, "templates");
}

export function topicSurveyDir(topicPath: string): string {
  return join(topicDir(topicPath), "survey");
}

export function surveyCatalogPath(topicPath: string): string {
  return join(topicSurveyDir(topicPath), "catalog.json");
}

export function surveyCatalogCsvPath(topicPath: string): string {
  return join(topicSurveyDir(topicPath), "catalog.csv");
}

export function surveyQueriesPath(topicPath: string): string {
  return join(topicSurveyDir(topicPath), "queries.txt");
}
