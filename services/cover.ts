import type { ICoverUploadService } from "@/interface/ICoverUpload";
import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export class CoverUploadService implements ICoverUploadService {
  private s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async saveCover(
    userId: string,
    file: Buffer,
    mimeType: string,
  ): Promise<string> {
    const ext = MIME_TO_EXT[mimeType];
    if (!ext) throw new Error("Invalid image type");

    const key = `covers/${userId}/${randomUUID()}.${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );

    return key;
  }

  async deleteCover(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
      }),
    );
  }
}
