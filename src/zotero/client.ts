import type { PaperRecord } from "../types.js";

const BASE = "https://api.zotero.org";

export interface ZoteroKeyInfo {
  userID: number;
  username: string;
  access: { user?: { id: number; username: string } };
}

export interface ZoteroCollection {
  key: string;
  data: { key: string; name: string; parentCollection?: string };
  meta: { numItems: number };
}

export interface ZoteroItem {
  key: string;
  data: {
    key: string;
    itemType: string;
    title?: string;
    DOI?: string;
    extra?: string;
  };
}

function getApiKey(): string {
  const key = process.env.ZOTERO_API_KEY?.trim();
  if (!key) throw new Error("ZOTERO_API_KEY not set in .env");
  return key;
}

function authHeaders(): Record<string, string> {
  return {
    "Zotero-API-Key": getApiKey(),
    "Zotero-API-Version": "3",
  };
}

async function zoteroFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers as Record<string, string>) },
  });

  if (res.status === 429 || res.status === 503) {
    const retry = parseInt(res.headers.get("Retry-After") ?? "5", 10);
    await sleep(retry * 1000);
    return zoteroFetch(path, init);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Zotero ${res.status}: ${body.slice(0, 200)}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getKeyInfo(): Promise<ZoteroKeyInfo> {
  return zoteroFetch<ZoteroKeyInfo>("/keys/current");
}

export async function listCollections(userId: number): Promise<ZoteroCollection[]> {
  return zoteroFetch<ZoteroCollection[]>(`/users/${userId}/collections?limit=100`);
}

export async function listTopLevelItems(userId: number): Promise<ZoteroItem[]> {
  return zoteroFetch<ZoteroItem[]>(
    `/users/${userId}/items/top?limit=100&format=json&itemType=-attachment`
  );
}

export async function createCollection(
  userId: number,
  name: string,
  parentKey?: string
): Promise<string> {
  const body = [{ name, parentCollection: parentKey ?? false }];
  const result = await zoteroFetch<{ successful: Record<string, { key: string }> }>(
    `/users/${userId}/collections`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const keys = Object.values(result.successful ?? {});
  if (keys.length === 0) throw new Error("Failed to create Zotero collection");
  return keys[0].key;
}

function parseAuthorName(name: string): { creatorType: string; name: string } {
  return { creatorType: "author", name };
}

export function paperToZoteroItem(p: PaperRecord): Record<string, unknown> {
  const arxiv = p.externalIds.ArXiv;
  const doi = p.externalIds.DOI;
  const itemType = arxiv && !p.venue ? "preprint" : "journalArticle";

  const item: Record<string, unknown> = {
    itemType,
    title: p.title,
    creators: p.authors.map(parseAuthorName),
    abstractNote: p.abstract ?? "",
    url: p.url ?? (arxiv ? `https://arxiv.org/abs/${arxiv}` : undefined),
    extra: `s2PaperId: ${p.paperId}`,
  };

  if (p.year) item.date = String(p.year);
  if (p.venue) item.publicationTitle = p.venue;
  if (doi) item.DOI = doi;
  if (arxiv) item.archiveID = arxiv;

  return item;
}

export async function createItems(
  userId: number,
  items: Record<string, unknown>[],
  collectionKey?: string
): Promise<number> {
  const batchSize = 50;
  let created = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize).map((data) => {
      const entry: Record<string, unknown> = { itemType: data.itemType, ...data };
      if (collectionKey) entry.collections = [collectionKey];
      return entry;
    });

    await zoteroFetch(`/users/${userId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batch),
    });

    created += batch.length;
    await sleep(500);
  }

  return created;
}

export async function findOrCreateCollection(
  userId: number,
  name: string
): Promise<string> {
  const pinned = process.env.ZOTERO_COLLECTION_KEY?.trim();
  if (pinned) return pinned;

  const collections = await listCollections(userId);
  const existing = collections.find((c) => c.data.name === name);
  if (existing) return existing.data.key;

  return createCollection(userId, name);
}

export function extractS2Id(extra?: string): string | undefined {
  if (!extra) return undefined;
  const m = extra.match(/s2PaperId:\s*(\S+)/);
  return m?.[1];
}

export async function fetchExistingIds(userId: number): Promise<{
  s2Ids: Set<string>;
  dois: Set<string>;
}> {
  const s2Ids = new Set<string>();
  const dois = new Set<string>();

  let start = 0;
  const limit = 100;

  while (true) {
    const items = await zoteroFetch<ZoteroItem[]>(
      `/users/${userId}/items/top?limit=${limit}&start=${start}&format=json&itemType=-attachment`
    );
    if (items.length === 0) break;

    for (const item of items) {
      const s2 = extractS2Id(item.data.extra);
      if (s2) s2Ids.add(s2);
      if (item.data.DOI) dois.add(item.data.DOI.toLowerCase());
    }

    if (items.length < limit) break;
    start += limit;
    await sleep(300);
  }

  return { s2Ids, dois };
}
