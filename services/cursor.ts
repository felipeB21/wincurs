import type { ICursorFileUploadService } from "@/interface/ICursorUpload";
import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID, createHash } from "crypto";

const FILE_MIME_TO_EXT: Record<string, string> = {
  "image/x-icon": "cur",
  "image/vnd.microsoft.icon": "cur",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "application/octet-stream": "zip",
  "application/x-rar-compressed": "rar",
};

export class CursorFileUploadService implements ICursorFileUploadService {
  private static readonly MAX_FILE_SIZE_MB = 20;

  private s3 = new S3Client({
    region: process.env.AWS_REGION!,
  });

  static isValidMimeType(mime: string) {
    return Object.keys(FILE_MIME_TO_EXT).includes(mime);
  }

  static isValidFileSize(size: number) {
    return size <= CursorFileUploadService.MAX_FILE_SIZE_MB * 1024 * 1024;
  }

  async saveFile(
    userId: string,
    file: Buffer,
    mimeType: string,
  ): Promise<{ key: string; size: string; checksum: string }> {
    const ext = FILE_MIME_TO_EXT[mimeType];
    if (!ext) throw new Error("Invalid cursor file type");

    if (!CursorFileUploadService.isValidFileSize(file.byteLength))
      throw new Error("File exceeds 20MB limit");

    const key = `files/${userId}/${randomUUID()}.${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );

    return {
      key,
      size: `${(file.byteLength / 1024 / 1024).toFixed(2)}MB`,
      checksum: createHash("sha256").update(file).digest("hex"),
    };
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
      }),
    );
  }
}
