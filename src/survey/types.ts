export interface SurveyEntry {
  paperId: string;
  title: string;
  year?: number;
  authors?: string[];
  venue?: string;
  citationCount?: number;
  url?: string;
  abstract?: string;
  queryTags: string[];
  harvestedAt: string;
}

export interface SurveyCatalog {
  topicPath: string;
  updatedAt: string;
  entries: SurveyEntry[];
}
