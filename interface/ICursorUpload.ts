export interface ICursorFileUploadService {
  saveFile(
    userId: string,
    file: Buffer,
    mimeType: string
  ): Promise<{
    key: string;
    size: string;
    checksum: string;
  }>;

  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
  deleteFile(key: string): Promise<void>;
}
