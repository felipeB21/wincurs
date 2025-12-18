export interface ICoverUploadService {
  saveCover(userId: string, file: Buffer, mimeType: string): Promise<string>;
}
