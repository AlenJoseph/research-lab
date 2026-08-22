import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { topicGraphDir } from "../paths.js";
import type { EdgeType, TopicGraph } from "../types.js";
import { loadGraph } from "./store.js";

const EDGE_COLORS: Record<EdgeType, string> = {
  cites: "#4a90d9",
  cited_by: "#7eb6e0",
  extends: "#2ecc71",
  contrasts: "#e74c3c",
  uses_method: "#9b59b6",
  builds_on: "#f39c12",
  related: "#95a5a6",
};

function mermaidSafe(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}

export function toMermaid(graph: TopicGraph): string {
  const lines: string[] = [
    "# Paper relations",
    "",
    "Auto-generated from `graph.json`. Open `relations.html` for interactive view.",
    "",
    "```mermaid",
    "flowchart LR",
  ];

  for (const node of graph.nodes) {
    const nid = mermaidSafe(node.id);
    const prefix = node.source === "meta" ? "meta::" : "";
    lines.push(`  ${nid}["${prefix}${node.label.replace(/"/g, "'")}"]`);
  }

  for (const edge of graph.edges) {
    const from = mermaidSafe(edge.from);
    const to = mermaidSafe(edge.to);
    const label = edge.type + (edge.note ? `: ${edge.note.slice(0, 30)}` : "");
    lines.push(`  ${from} -->|${label.replace(/"/g, "'")}| ${to}`);
  }

  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

export function toHtml(graph: TopicGraph): string {
  const nodes = graph.nodes.map((n) => ({
    id: n.id,
    label: n.label,
    title: `${n.source} · ${n.role ?? ""}`,
    color: n.source === "meta" ? "#e8f4fc" : "#f5f5f5",
  }));

  const edges = graph.edges.map((e, i) => ({
    id: i,
    from: e.from,
    to: e.to,
    label: e.type,
    title: e.note ?? e.type,
    color: EDGE_COLORS[e.type],
  }));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Research Lab — relations</title>
  <script src="https://unpkg.com/vis-network@9.1.9/standalone/umd/vis-network.min.js"></script>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    #graph { width: 100vw; height: 100vh; }
    #legend { position: fixed; top: 12px; left: 12px; background: #fff; padding: 10px 14px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.12); font-size: 12px; }
    #legend span { display: inline-block; width: 12px; height: 12px; margin-right: 6px; border-radius: 2px; vertical-align: middle; }
  </style>
</head>
<body>
  <div id="legend">
    <strong>Edge types</strong><br/>
    ${Object.entries(EDGE_COLORS)
      .map(([t, c]) => `<div><span style="background:${c}"></span>${t}</div>`)
      .join("")}
  </div>
  <div id="graph"></div>
  <script>
    const nodes = new vis.DataSet(${JSON.stringify(nodes)});
    const edges = new vis.DataSet(${JSON.stringify(edges)});
    const container = document.getElementById("graph");
    new vis.Network(container, { nodes, edges }, {
      physics: { stabilization: { iterations: 120 } },
      edges: { arrows: "to", font: { size: 10, align: "middle" } },
      nodes: { font: { size: 11 } }
    });
  </script>
</body>
</html>
`;
}

export async function writeVisualizations(topicPath: string): Promise<void> {
  const graph = await loadGraph(topicPath);
  const dir = topicGraphDir(topicPath);
  await writeFile(join(dir, "relations.md"), toMermaid(graph), "utf-8");
  await writeFile(join(dir, "relations.html"), toHtml(graph), "utf-8");
}
