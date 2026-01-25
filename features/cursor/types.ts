// Re-export cursor types from interface
export type { Cursor } from "@/interface/ICursor";

// Additional cursor-related types
export interface CursorFilters {
  limit?: number;
  offset?: number;
  q?: string;
}

export interface CursorListResponse {
  cursors: CursorCard[];
  hasMore: boolean;
  nextOffset: number;
}

export interface CursorCard {
  id: string;
  name: string;
  previewImage: string | null;
  createdAt: Date;
  userId: string;
  userName: string;
  username: string;
  userImage: string | null;
  userTier: "free" | "premium";
  likes: number;
  downloads: number;
}
