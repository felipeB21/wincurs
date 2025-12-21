import { Elysia, t } from "elysia";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { cursor, cursorLike, user } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { CoverUploadService } from "@/services/cover";
import { CursorFileUploadService } from "@/services/cursor";
import { eq, desc, sql } from "drizzle-orm";

type CursorFileType = "cur" | "zip" | "rar";

function resolveFileType(mime: string): CursorFileType {
  if (mime.includes("zip")) return "zip";
  if (mime.includes("rar")) return "rar";
  return "cur";
}

export const cursorRoute = new Elysia({ prefix: "/cursor" })
  .post(
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
  )
  .get("/user/:username", async ({ params, set }) => {
    const { username } = params as { username: string };

    const users = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.username, username));

    const getUser = users[0];
    if (!getUser) {
      set.status = 404;
      return { error: "User not found" };
    }

    const userCursors = await db
      .select({
        id: cursor.id,
        name: cursor.name,
        description: cursor.description,
        previewImage: cursor.previewImage,
        fileUrl: cursor.fileUrl,
        fileType: cursor.fileType,
        fileSize: cursor.fileSize,
        checksum: cursor.checksum,
        createdAt: cursor.createdAt,
      })
      .from(cursor)
      .where(eq(cursor.userId, getUser.id))
      .orderBy(desc(cursor.createdAt));

    if (userCursors.length === 0) return { message: "User has no cursors yet" };

    const coverService = new CoverUploadService();
    const fileService = new CursorFileUploadService();

    const cursorsWithUrls = await Promise.all(
      userCursors.map(async (c) => ({
        ...c,
        previewImage: await coverService.getSignedUrl(c.previewImage),
        fileUrl: await fileService.getSignedUrl(c.fileUrl),
      }))
    );

    return { cursors: cursorsWithUrls };
  })
  .get("/:id", async ({ params }) => {
    const { id } = params as { id: string };

    const cursorById = await db.select().from(cursor).where(eq(cursor.id, id));
    if (!cursorById) return { message: "Cursor not found" };

    const coverService = new CoverUploadService();
    const fileService = new CursorFileUploadService();

    return {
      ...cursorById[0],
      previewImage: await coverService.getSignedUrl(cursorById[0].previewImage),
      fileUrl: await fileService.getSignedUrl(cursorById[0].fileUrl),
    };
  })
  .get(
    "/desc",
    async ({ query }) => {
      const limit = query.limit;
      const offset = query.offset;

      const cursors = await db
        .select({
          id: cursor.id,
          name: cursor.name,
          description: cursor.description,
          previewImage: cursor.previewImage,
          fileUrl: cursor.fileUrl,
          createdAt: cursor.createdAt,
          userId: user.id,
          username: user.username,
          userAvatar: user.image,
        })
        .from(cursor)
        .innerJoin(user, eq(cursor.userId, user.id))
        .orderBy(desc(cursor.createdAt))
        .limit(limit);

      const coverService = new CoverUploadService();
      const fileService = new CursorFileUploadService();

      const cursorsWithUrls = await Promise.all(
        cursors.map(async (c) => ({
          ...c,
          previewImage: await coverService.getSignedUrl(c.previewImage),
          fileUrl: await fileService.getSignedUrl(c.fileUrl),
        }))
      );

      return {
        cursors: cursorsWithUrls,
        hasMore: cursors.length === limit,
        nextOffset: offset + cursors.length,
      };
    },
    {
      query: t.Object({
        limit: t.Number({ default: 6 }),
        offset: t.Number({ default: 0 }),
      }),
    }
  )
  .get(
    "/most-liked",
    async ({ query }) => {
      const limit = query.limit;
      const offset = query.offset;

      const rows = await db
        .select({
          id: cursor.id,
          name: cursor.name,
          description: cursor.description,
          previewImage: cursor.previewImage,
          fileUrl: cursor.fileUrl,
          createdAt: cursor.createdAt,
          userId: user.id,
          username: user.username,
          userAvatar: user.image,
          likeCount: sql<number>`count(${cursorLike.id})`.as("likeCount"),
        })
        .from(cursor)
        .leftJoin(cursorLike, eq(cursor.id, cursorLike.cursorId))
        .innerJoin(user, eq(cursor.userId, user.id))
        .groupBy(cursor.id, user.id)
        .orderBy(sql`count(${cursorLike.id}) DESC`, desc(cursor.createdAt))
        .limit(limit)
        .offset(offset);

      const coverService = new CoverUploadService();
      const fileService = new CursorFileUploadService();

      const cursorsWithUrls = await Promise.all(
        rows.map(async (c) => ({
          ...c,
          previewImage: await coverService.getSignedUrl(c.previewImage),
          fileUrl: await fileService.getSignedUrl(c.fileUrl),
        }))
      );

      return {
        cursors: cursorsWithUrls,
        hasMore: rows.length === limit,
        nextOffset: offset + rows.length,
      };
    },
    {
      query: t.Object({
        limit: t.Number({ default: 20 }),
        offset: t.Number({ default: 0 }),
      }),
    }
  );
