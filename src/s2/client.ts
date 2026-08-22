import type { S2Paper } from "../types.js";

const BASE = "https://api.semanticscholar.org/graph/v1";

const PAPER_FIELDS =
  "paperId,title,year,authors,venue,citationCount,externalIds,url,abstract,tldr,openAccessPdf";

/** S2 key limit: 1 req/s cumulative across endpoints — use a small buffer. */
const KEYED_INTERVAL_MS = 1100;

/** Shared unauthenticated pool — slower and bursty. */
const PUBLIC_INTERVAL_MS = 3000;

export class S2Client {
  private lastRequestAt = 0;
  private minIntervalMs = PUBLIC_INTERVAL_MS;
  private keyed = false;

  constructor() {
    this.refreshRateLimit();
  }

  private getApiKey(): string | undefined {
    return process.env.SEMANTIC_SCHOLAR_API_KEY?.trim() || undefined;
  }

  /** Re-read env and pick interval (call after loadEnv). */
  refreshRateLimit(): void {
    const key = this.getApiKey();
    this.keyed = Boolean(key);
    this.minIntervalMs = this.keyed ? KEYED_INTERVAL_MS : PUBLIC_INTERVAL_MS;
  }

  isAuthenticated(): boolean {
    return this.keyed;
  }

  private async throttle(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestAt;
    if (elapsed < this.minIntervalMs) {
      await sleep(this.minIntervalMs - elapsed);
    }
  }

  private markRequestComplete(): void {
    this.lastRequestAt = Date.now();
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    const key = this.getApiKey();
    if (key) {
      headers["x-api-key"] = key;
    }

    let attempt = 0;
    const maxAttempts = 10;

    while (attempt < maxAttempts) {
      await this.throttle();
      const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: { ...headers, ...init?.headers },
      });
      this.markRequestComplete();

      if (res.ok) {
        return res.json() as Promise<T>;
      }

      if (res.status === 429 || res.status >= 500) {
        const retryAfter = res.headers.get("Retry-After");
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.min(1000 * 2 ** attempt, 30000);
        await sleep(waitMs);
        attempt++;
        continue;
      }

      const body = await res.text();
      throw new Error(`S2 API ${res.status}: ${body.slice(0, 300)}`);
    }

    throw new Error(`S2 API failed after ${maxAttempts} attempts: ${path}`);
  }

  async searchPapers(query: string, limit = 15): Promise<S2Paper[]> {
    const params = new URLSearchParams({
      query,
      limit: String(Math.min(limit, 100)),
      fields: PAPER_FIELDS,
    });
    const data = await this.request<{ data?: S2Paper[] }>(`/paper/search?${params}`);
    return data.data ?? [];
  }

  async matchPaperByTitle(title: string): Promise<S2Paper | null> {
    const params = new URLSearchParams({
      query: title,
      fields: PAPER_FIELDS,
    });
    try {
      const data = await this.request<{ data?: S2Paper[] }>(
        `/paper/search/match?${params}`
      );
      return data.data?.[0] ?? null;
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        return null;
      }
      throw err;
    }
  }

  async getPaper(paperId: string): Promise<S2Paper> {
    const id = encodeURIComponent(normalizePaperId(paperId));
    return this.request<S2Paper>(`/paper/${id}?fields=${PAPER_FIELDS}`);
  }

  async getCitations(
    paperId: string,
    limit = 100,
    offset = 0
  ): Promise<{ citingPaper: S2Paper }[]> {
    const id = encodeURIComponent(normalizePaperId(paperId));
    const params = new URLSearchParams({
      fields: "citingPaper.paperId",
      limit: String(Math.min(limit, 1000)),
      offset: String(offset),
    });
    const data = await this.request<{ data?: { citingPaper: S2Paper }[] }>(
      `/paper/${id}/citations?${params}`
    );
    return data.data ?? [];
  }

  async getReferences(
    paperId: string,
    limit = 100,
    offset = 0
  ): Promise<{ citedPaper: S2Paper }[]> {
    const id = encodeURIComponent(normalizePaperId(paperId));
    const params = new URLSearchParams({
      fields: "citedPaper.paperId",
      limit: String(Math.min(limit, 1000)),
      offset: String(offset),
    });
    const data = await this.request<{ data?: { citedPaper: S2Paper }[] }>(
      `/paper/${id}/references?${params}`
    );
    return data.data ?? [];
  }
}

export function normalizePaperId(id: string): string {
  const trimmed = id.trim();
  if (
    trimmed.startsWith("ARXIV:") ||
    trimmed.startsWith("DOI:") ||
    trimmed.startsWith("CorpusId:") ||
    trimmed.startsWith("PMID:") ||
    trimmed.startsWith("ACL:") ||
    trimmed.startsWith("URL:")
  ) {
    return trimmed;
  }
  if (trimmed.match(/^\d+\.\d+$/)) {
    return `ARXIV:${trimmed}`;
  }
  return trimmed;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
