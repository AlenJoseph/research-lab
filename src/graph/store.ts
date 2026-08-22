import { readFile, writeFile } from "node:fs/promises";
import { topicGraphPath } from "../paths.js";
import type { EdgeType, GraphEdge, GraphNode, PaperRecord, TopicGraph } from "../types.js";
import { loadAllCorpusIds } from "../corpus.js";

export const CURATED_EDGE_TYPES: EdgeType[] = [
  "extends",
  "contrasts",
  "uses_method",
  "builds_on",
  "related",
];

export const S2_EDGE_TYPES: EdgeType[] = ["cites", "cited_by"];

export async function loadGraph(topicPath: string): Promise<TopicGraph> {
  try {
    const raw = await readFile(topicGraphPath(topicPath), "utf-8");
    return JSON.parse(raw) as TopicGraph;
  } catch {
    return { nodes: [], edges: [] };
  }
}

export async function saveGraph(topicPath: string, graph: TopicGraph): Promise<void> {
  await writeFile(topicGraphPath(topicPath), JSON.stringify(graph, null, 2) + "\n", "utf-8");
}

export function shortLabel(title: string, max = 48): string {
  if (title.length <= max) return title;
  return title.slice(0, max - 1) + "…";
}

export function upsertNode(
  graph: TopicGraph,
  record: PaperRecord,
  source: "topic" | "meta"
): void {
  const existing = graph.nodes.find((n) => n.id === record.paperId);
  const node: GraphNode = {
    id: record.paperId,
    source,
    label: shortLabel(record.title),
    role: record.role,
  };
  if (existing) {
    Object.assign(existing, node);
  } else {
    graph.nodes.push(node);
  }
}

export function upsertEdge(
  graph: TopicGraph,
  from: string,
  to: string,
  type: EdgeType,
  origin: "s2" | "curated",
  note?: string
): void {
  const key = `${from}|${to}|${type}`;
  const found = graph.edges.find(
    (e) => e.from === from && e.to === to && e.type === type
  );
  if (found) {
    if (note) found.note = note;
    return;
  }
  graph.edges.push({ from, to, type, origin, note });
}

export async function validateGraph(topicPath: string, graph: TopicGraph): Promise<TopicGraph> {
  const corpus = await loadAllCorpusIds(topicPath);
  const validIds = new Set(corpus.keys());

  graph.nodes = graph.nodes.filter((n) => validIds.has(n.id));
  graph.edges = graph.edges.filter(
    (e) => validIds.has(e.from) && validIds.has(e.to)
  );

  return graph;
}

export async function ensureNodesFromCorpus(
  topicPath: string,
  graph: TopicGraph
): Promise<TopicGraph> {
  const { loadTopicAndMetaRecords } = await import("../corpus.js");
  const { meta, topic } = await loadTopicAndMetaRecords(topicPath);

  for (const p of meta) {
    upsertNode(graph, p, "meta");
  }
  for (const p of topic) {
    upsertNode(graph, p, "topic");
  }

  return graph;
}
