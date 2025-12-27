export interface Cursor {
  id: string;
  name: string;
  description?: string | null;
  previewImage: string;
  createdAt: string;
  likes: number;
  downloads: number;
  likedByUser: boolean;
  username: string;
  userName: string;
  userImage?: string | null;
}
