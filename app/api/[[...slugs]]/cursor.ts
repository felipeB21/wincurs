import { Elysia, t } from "elysia";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { cursor } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { CoverUploadService } from "@/services/cover";
import { CursorFileUploadService } from "@/services/cursor";

type CursorFileType = "cur" | "zip" | "rar";

function resolveFileType(mime: string): CursorFileType {
  if (mime.includes("zip")) return "zip";
  if (mime.includes("rar")) return "rar";
  return "cur";
}

export const cursorRoute = new Elysia({ prefix: "/cursor" }).post(
  "/post",
  async ({ body, set }) => {
    const session = await getSession();

    if (!session?.user?.id) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;
    const { name, description, cover, file } = body;

    if (!cover || !file) {
      set.status = 400;
      return { error: "Cover image and cursor file are required" };
    }

    const coverService = new CoverUploadService();
    const fileService = new CursorFileUploadService();

    const coverBuffer = Buffer.from(await cover.arrayBuffer());
    const coverKey = await coverService.saveCover(
      userId,
      coverBuffer,
      cover.type
    );

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileResult = await fileService.saveFile(
      userId,
      fileBuffer,
      file.type
    );

    const cursorId = randomUUID();

    await db.insert(cursor).values({
      id: cursorId,
      name,
      description,
      previewImage: coverKey,
      fileUrl: fileResult.key,
      fileSize: fileResult.size,
      checksum: fileResult.checksum,
      fileType: resolveFileType(file.type),
      userId,
    });

    set.status = 201;
    return {
      id: cursorId,
      name,
      previewImage: coverKey,
      fileUrl: fileResult.key,
    };
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
      cover: t.File(),
      file: t.File(),
    }),
  }
);
