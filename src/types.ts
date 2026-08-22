export type PaperRole = "foundation" | "topic" | "method" | "critique";

export type EdgeType =
  | "cites"
  | "cited_by"
  | "extends"
  | "contrasts"
  | "uses_method"
  | "builds_on"
  | "related";

export type EdgeOrigin = "s2" | "curated";

export interface S2Author {
  authorId?: string;
  name: string;
}

export interface S2ExternalIds {
  DOI?: string;
  ArXiv?: string;
  PubMed?: string;
  ACL?: string;
}

export interface S2Paper {
  paperId: string;
  title: string;
  year?: number;
  authors?: S2Author[];
  venue?: string;
  citationCount?: number;
  externalIds?: S2ExternalIds;
  url?: string;
  abstract?: string;
  tldr?: { text?: string };
  openAccessPdf?: { url?: string };
}

export interface PaperQuote {
  text: string;
  source?: string;
}

export interface PaperRecord {
  paperId: string;
  title: string;
  year?: number;
  authors: string[];
  venue?: string;
  citationCount?: number;
  externalIds: S2ExternalIds;
  url?: string;
  abstract?: string;
  tldr?: string;
  openAccessPdfUrl?: string;
  role: PaperRole;
  whyIncluded: string;
  quotes: PaperQuote[];
  ingestedAt: string;
}

export interface GraphNode {
  id: string;
  source: "topic" | "meta";
  label: string;
  role?: PaperRole;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: EdgeType;
  origin: EdgeOrigin;
  note?: string;
}

export interface TopicGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CandidatePaper {
  paperId: string;
  title: string;
  year?: number;
  authors?: string[];
  venue?: string;
  citationCount?: number;
  url?: string;
  abstract?: string;
}
