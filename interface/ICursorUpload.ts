export interface ICursorFileUploadService {
  saveFile(
    userId: string,
    file: Buffer,
    mimeType: string,
  ): Promise<{
    key: string;
    size: string;
    checksum: string;
  }>;

  deleteFile(key: string): Promise<void>;
}
