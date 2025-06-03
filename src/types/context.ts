export type Project = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string; // ISO string for Date
  updatedAt: string; // ISO string for Date
  organizationId?: string;
  organization?: {
    id: string;
    name: string;
  };
}

export interface ContextItem {
  id: string;
  source?: string;
  collection?: string;
  score?: number;
  size?: number;
  content?: string;
  text?: string;
  recency?: number;
  feedbackScore?: number;
}

export interface ContextPreviewRequest {
  projectId: string;
  sourceIds: string[];
  collection?: string;
  method: string;
  query: string;
}

export interface ContextPreviewResult {
  queries: ContextItem[];
} 