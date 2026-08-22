import { S2Client } from "../s2/client.js";
import { loadAllCorpusIds } from "../corpus.js";
import {
  ensureNodesFromCorpus,
  loadGraph,
  saveGraph,
  upsertEdge,
  validateGraph,
} from "./store.js";

export async function syncGraph(topicPath: string): Promise<{ edgesAdded: number }> {
  const client = new S2Client();
  const corpus = await loadAllCorpusIds(topicPath);
  const corpusIds = new Set(corpus.keys());

  let graph = await loadGraph(topicPath);
  graph = await ensureNodesFromCorpus(topicPath, graph);

  let edgesAdded = 0;

  for (const paperId of corpusIds) {
    const refs = await client.getReferences(paperId, 100);
    for (const item of refs) {
      const cited = item.citedPaper;
      if (!cited?.paperId || !corpusIds.has(cited.paperId)) continue;
      upsertEdge(graph, paperId, cited.paperId, "cites", "s2");
      upsertEdge(graph, cited.paperId, paperId, "cited_by", "s2");
      edgesAdded++;
    }
  }

  graph = await validateGraph(topicPath, graph);
  await saveGraph(topicPath, graph);
  return { edgesAdded };
}
