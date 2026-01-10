export interface Cursor {
  id: string;
  name: string;
  previewImage: string;
  createdAt: Date;
  description: string | null;
  userId: string;
  userName: string;
  username: string;
  userImage: string | null;
  userTier: "free" | "premium";
  likes: number;
  downloads: number;
  likedByUser?: boolean;
}
