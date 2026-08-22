import { S2Client } from "../s2/client.js";
import { ingestPaper } from "../corpus.js";
import { loadCatalog } from "./store.js";
import type { PaperRole } from "../types.js";

export async function promoteToCore(
  client: S2Client,
  topicPath: string,
  paperId: string,
  role: PaperRole,
  why: string
): Promise<void> {
  const catalog = await loadCatalog(topicPath);
  const entry = catalog.entries.find((e) => e.paperId === paperId);
  if (!entry) {
    console.warn(`Paper ${paperId} not in survey catalog; ingesting from S2 anyway`);
  }
  const record = await ingestPaper(client, paperId, topicPath, role, why);
  console.log(`Promoted to core corpus: ${record.title}`);
}
