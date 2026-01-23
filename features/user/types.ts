export interface TopCreator {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  tier: string | null;
  cursorCount: number;
  totalLikes: number;
  totalDownloads: number;
  score: number;
}

export interface TopCreatorsResponse {
  creators: TopCreator[];
}
