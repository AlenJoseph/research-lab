import { loadTopicAndMetaRecords } from "../corpus.js";
import type { PaperRecord } from "../types.js";
import {
  createItems,
  fetchExistingIds,
  findOrCreateCollection,
  getKeyInfo,
  paperToZoteroItem,
} from "./client.js";

export interface ZoteroStatus {
  userId: number;
  username: string;
  itemCount: number;
  collectionKey?: string;
  collectionName?: string;
}

export async function getZoteroStatus(topicPath?: string): Promise<ZoteroStatus> {
  const keyInfo = await getKeyInfo();
  const userId = keyInfo.userID ?? keyInfo.access?.user?.id;
  if (!userId) throw new Error("Could not resolve Zotero user ID from API key");

  const username = keyInfo.username ?? keyInfo.access?.user?.username ?? "unknown";

  const { s2Ids } = await fetchExistingIds(userId);

  let collectionKey: string | undefined;
  let collectionName: string | undefined;

  if (topicPath) {
    const shortName = topicPath.replace(/^topics\//, "");
    collectionName = `research-lab/${shortName}`;
    collectionKey = await findOrCreateCollection(userId, collectionName);
  }

  return {
    userId,
    username,
    itemCount: s2Ids.size,
    collectionKey,
    collectionName,
  };
}

function shouldSkip(
  paper: PaperRecord,
  existing: { s2Ids: Set<string>; dois: Set<string> }
): boolean {
  if (existing.s2Ids.has(paper.paperId)) return true;
  const doi = paper.externalIds.DOI?.toLowerCase();
  if (doi && existing.dois.has(doi)) return true;
  return false;
}

export async function syncTopicToZotero(topicPath: string): Promise<{
  synced: number;
  skipped: number;
  collectionKey: string;
  collectionName: string;
}> {
  const keyInfo = await getKeyInfo();
  const userId = keyInfo.userID ?? keyInfo.access?.user?.id;
  if (!userId) throw new Error("Could not resolve Zotero user ID");

  const shortName = topicPath.replace(/^topics\//, "");
  const collectionName = `research-lab/${shortName}`;
  const collectionKey = await findOrCreateCollection(userId, collectionName);

  const { meta, topic } = await loadTopicAndMetaRecords(topicPath);
  const allPapers = [...meta, ...topic];

  const existing = await fetchExistingIds(userId);
  const toSync: PaperRecord[] = [];

  for (const p of allPapers) {
    if (!shouldSkip(p, existing)) toSync.push(p);
  }

  if (toSync.length === 0) {
    return { synced: 0, skipped: allPapers.length, collectionKey, collectionName };
  }

  const items = toSync.map(paperToZoteroItem);
  const synced = await createItems(userId, items, collectionKey);

  return {
    synced,
    skipped: allPapers.length - toSync.length,
    collectionKey,
    collectionName,
  };
}
