import { Elysia, t } from "elysia";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { cursor, cursorDownload, cursorLike, user } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { CoverUploadService } from "@/services/cover";
import { CursorFileUploadService } from "@/services/cursor";
import { eq, desc, sql, and } from "drizzle-orm";
import { AppError } from "../middleware/error-handler";

type CursorFileType = "cur" | "zip" | "rar";

function resolveFileType(mime: string): CursorFileType {
  if (mime.includes("zip")) return "zip";
  if (mime.includes("rar") || mime.includes("x-compressed")) return "rar";
  return "cur";
}

const getFullImageUrl = (key: string | null) =>
  key ? `${process.env.CLOUDFRONT_URL}/${key}` : null;

const getFullFileUrl = (key: string | null) =>
  key ? `${process.env.CLOUDFRONT_URL}/${key}` : null;

export const cursorRoutes = new Elysia({ prefix: "/cursor" })
  .derive(async () => {
    const session = await getSession();
    return {
      session,
      userId: session?.user?.id ?? null,
    };
  })
  .post(
    "/post",
    async ({ body, set, userId }) => {
      if (!userId) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const { name, description, cover, file } = body;

      if (!cover || !file) {
        throw AppError.badRequest("Cover image and cursor file are required");
      }

      const coverService = new CoverUploadService();
      const fileService = new CursorFileUploadService();

      const coverBuffer = Buffer.from(await cover.arrayBuffer());
      const coverKey = await coverService.saveCover(
        userId,
        coverBuffer,
        cover.type,
      );

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileResult = await fileService.saveFile(
        userId,
        fileBuffer,
        file.type,
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
        previewImage: getFullImageUrl(coverKey),
        fileUrl: getFullFileUrl(fileResult.key),
      };
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.Optional(t.String()),
        cover: t.File(),
        file: t.File(),
      }),
    },
  )
  .get("/user/:username", async ({ params }) => {
    const { username } = params as { username: string };

    const users = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.username, username));

    const getUser = users[0];
    if (!getUser) {
      throw AppError.notFound("User not found");
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

    const cursorsWithUrls = userCursors.map((c) => ({
      ...c,
      previewImage: getFullImageUrl(c.previewImage),
      fileUrl: getFullFileUrl(c.fileUrl),
    }));

    return { cursors: cursorsWithUrls };
  })
  .get("/:id", async ({ params, userId }) => {
    const { id } = params as { id: string };

    const rows = await db
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
        userId: user.id,
        userName: user.name,
        username: user.username,
        userImage: user.image,
        userTier: user.tier,

        likes: sql<number>`
  (select count(*)::int from cursor_like where cursor_id = ${cursor.id})
`,
        downloads: sql<number>`
  (select count(*)::int from cursor_download where cursor_id = ${cursor.id})
`,

        likedByUser: sql<boolean>`
        exists(
          select 1 from cursor_like
          where cursor_like.cursor_id = ${cursor.id}
          and cursor_like.user_id = ${userId}
        )
      `,
      })
      .from(cursor)
      .innerJoin(user, eq(cursor.userId, user.id))
      .leftJoin(cursorLike, eq(cursorLike.cursorId, cursor.id))
      .leftJoin(cursorDownload, eq(cursorDownload.cursorId, cursor.id))
      .where(eq(cursor.id, id))
      .groupBy(cursor.id, user.id);

    if (rows.length === 0) return { message: "Cursor not found" };

    const c = rows[0];

    return {
      ...c,
      previewImage: getFullImageUrl(c.previewImage),
      fileUrl: getFullFileUrl(c.fileUrl),
    };
  })
  .get(
    "/desc",
    async ({ query }) => {
      const { limit, offset } = query;

      const rows = await db
        .select({
          id: cursor.id,
          name: cursor.name,
          previewImage: cursor.previewImage,
          createdAt: cursor.createdAt,
          userId: user.id,
          userName: user.name,
          username: user.username,
          userImage: user.image,
          userTier: user.tier,
          likes: sql<number>`
          (select count(*)::int
           from cursor_like
           where cursor_like.cursor_id = ${cursor.id})
        `,
          downloads: sql<number>`
          (select count(*)::int
           from cursor_download
           where cursor_download.cursor_id = ${cursor.id})
        `,
        })
        .from(cursor)
        .innerJoin(user, eq(cursor.userId, user.id))
        .orderBy(desc(cursor.createdAt))
        .limit(limit)
        .offset(offset);

      const cursorsWithUrls = rows.map((c) => ({
        ...c,
        previewImage: getFullImageUrl(c.previewImage),
      }));

      return {
        cursors: cursorsWithUrls,
        hasMore: rows.length === limit,
        nextOffset: offset + rows.length,
      };
    },
    {
      query: t.Object({
        limit: t.Number({ default: 6 }),
        offset: t.Number({ default: 0 }),
      }),
    },
  )
  .get(
    "/search",
    async ({ query }) => {
      const { q, limit, offset } = query;

      if (!q || q.trim().length === 0) {
        return { cursors: [], hasMore: false, nextOffset: offset };
      }

      const rows = await db
        .select({
          id: cursor.id,
          name: cursor.name,
          previewImage: cursor.previewImage,
          createdAt: cursor.createdAt,
          userId: user.id,
          userName: user.name,
          username: user.username,
          userImage: user.image,
          userTier: user.tier,
          likes: sql<number>`
          (select count(*)::int
           from cursor_like
           where cursor_like.cursor_id = ${cursor.id})
        `,
          downloads: sql<number>`
          (select count(*)::int
           from cursor_download
           where cursor_download.cursor_id = ${cursor.id})
        `,
        })
        .from(cursor)
        .innerJoin(user, eq(cursor.userId, user.id))
        .where(sql`${cursor.name} ILIKE ${`%${q}%`}`)
        .orderBy(desc(cursor.createdAt))
        .limit(limit)
        .offset(offset);

      const cursorsWithUrls = rows.map((c) => ({
        ...c,
        previewImage: getFullImageUrl(c.previewImage),
      }));

      return {
        cursors: cursorsWithUrls,
        hasMore: rows.length === limit,
        nextOffset: offset + rows.length,
      };
    },
    {
      query: t.Object({
        q: t.String(),
        limit: t.Number({ default: 10 }),
        offset: t.Number({ default: 0 }),
      }),
    },
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
          previewImage: cursor.previewImage,
          fileUrl: cursor.fileUrl,
          createdAt: cursor.createdAt,
          userId: user.id,
          userName: user.name,
          username: user.username,
          userImage: user.image,
          userTier: user.tier,
          likes: sql<number>`count(${cursorLike.id})::int`.as("likes"),
          downloads: sql<number>`
            (select count(*)::int
             from cursor_download
             where cursor_download.cursor_id = ${cursor.id})
          `,
        })
        .from(cursor)
        .leftJoin(cursorLike, eq(cursor.id, cursorLike.cursorId))
        .innerJoin(user, eq(cursor.userId, user.id))
        .groupBy(cursor.id, user.id)
        .orderBy(sql`count(${cursorLike.id}) DESC`, desc(cursor.createdAt))
        .limit(limit)
        .offset(offset);

      const cursorsWithUrls = rows.map((c) => ({
        ...c,
        previewImage: getFullImageUrl(c.previewImage),
        fileUrl: getFullFileUrl(c.fileUrl),
      }));

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
    },
  )
  .get("/related/:id", async ({ params }) => {
    const { id } = params as { id: string };

    const cursorBase = await db
      .select({
        id: cursor.id,
        name: cursor.name,
      })
      .from(cursor)
      .where(eq(cursor.id, id));

    if (cursorBase.length === 0) {
      return [];
    }

    const mapCursor = (c: any) => ({
      ...c,
      previewImage: getFullImageUrl(c.previewImage),
    });
    const baseName = cursorBase[0].name.toLowerCase();

    const related = await db
      .select({
        id: cursor.id,
        name: cursor.name,
        previewImage: cursor.previewImage,
        createdAt: cursor.createdAt,
        userId: user.id,
        userName: user.name,
        username: user.username,
        userImage: user.image,
        userTier: user.tier,
        likes: sql<number>`
        (select count(*)::int
         from cursor_like
         where cursor_like.cursor_id = ${cursor.id})
      `,
        downloads: sql<number>`
        (select count(*)::int
         from cursor_download
         where cursor_download.cursor_id = ${cursor.id})
      `,
      })
      .from(cursor)
      .innerJoin(user, eq(cursor.userId, user.id))
      .where(
        and(
          sql`${cursor.name} ILIKE ${"%" + baseName.split(" ")[0] + "%"}`,
          sql`${cursor.id} != ${id}`,
        ),
      )
      .orderBy(desc(cursor.createdAt))
      .limit(10);

    if (related.length > 0) {
      return await Promise.all(related.map(mapCursor));
    }

    const fallback = await db
      .select({
        id: cursor.id,
        name: cursor.name,
        previewImage: cursor.previewImage,
        createdAt: cursor.createdAt,

        userId: user.id,
        userName: user.name,
        username: user.username,
        userImage: user.image,
        userTier: user.tier,

        likes: sql<number>`
      (select count(*)::int
       from cursor_like
       where cursor_like.cursor_id = ${cursor.id})
    `,
        downloads: sql<number>`
      (select count(*)::int
       from cursor_download
       where cursor_download.cursor_id = ${cursor.id})
    `,
      })
      .from(cursor)
      .innerJoin(user, eq(cursor.userId, user.id))
      .where(sql`${cursor.id} != ${id}`)
      .orderBy(desc(cursor.createdAt))
      .limit(5);

    return await Promise.all(fallback.map(mapCursor));
  })
  .get(
    "/popular",
    async ({ query }) => {
      const limit = query.limit;
      const offset = query.offset;

      const cursors = await db
        .select({
          id: cursor.id,
          name: cursor.name,
          previewImage: cursor.previewImage,
          createdAt: cursor.createdAt,
          fileUrl: cursor.fileUrl,
          userId: user.id,
          userName: user.name,
          username: user.username,
          userImage: user.image,
          userTier: user.tier,
          likes: sql<number>`
          (select count(*)::int
           from cursor_like
           where cursor_like.cursor_id = ${cursor.id})
        `,
          downloads: sql<number>`
          (select count(*)::int
           from cursor_download
           where cursor_download.cursor_id = ${cursor.id})
        `,
        })
        .from(cursor)
        .innerJoin(user, eq(cursor.userId, user.id))
        .orderBy(
          desc(sql`
          (
            (select count(*) from cursor_like where cursor_like.cursor_id = ${cursor.id}) +
            (select count(*) from cursor_download where cursor_download.cursor_id = ${cursor.id})
          )
        `),
        )
        .limit(limit)
        .offset(offset);

      const cursorsWithUrls = cursors.map((c) => ({
        ...c,
        previewImage: getFullImageUrl(c.previewImage),
        fileUrl: getFullFileUrl(c.fileUrl),
      }));

      return {
        cursors: cursorsWithUrls,
        hasMore: cursors.length === limit,
        nextOffset: offset + cursors.length,
      };
    },
    {
      query: t.Object({
        limit: t.Number({ default: 20 }),
        offset: t.Number({ default: 0 }),
      }),
    },
  )
  .post("/:id/download", async ({ params }) => {
    const { id } = params;

    const [c] = await db
      .select({ fileUrl: cursor.fileUrl })
      .from(cursor)
      .where(eq(cursor.id, id));

    if (!c) throw AppError.notFound("Cursor not found");

    db.insert(cursorDownload)
      .values({
        id: randomUUID(),
        cursorId: id,
      })
      .catch(console.error);

    return {
      fileUrl: getFullFileUrl(c.fileUrl),
    };
  })
  .post("/:id/like", async ({ params, set, userId }) => {
    if (!userId) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const { id } = params as { id: string };

    const existingLike = await db.query.cursorLike.findFirst({
      where: (cl, { and, eq }) =>
        and(eq(cl.cursorId, id), eq(cl.userId, userId)),
    });

    if (existingLike) {
      await db.delete(cursorLike).where(eq(cursorLike.id, existingLike.id));

      return { liked: false };
    }

    await db.insert(cursorLike).values({
      id: randomUUID(),
      cursorId: id,
      userId,
    });

    return { liked: true };
  })
  .post("/:id/delete", async ({ params, set, userId }) => {
    if (!userId) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const { id } = params;

    const [c] = await db.select().from(cursor).where(eq(cursor.id, id));

    if (!c) {
      throw AppError.notFound("Cursor not found");
    }

    if (c.userId !== userId) {
      throw AppError.forbidden(
        "You don't have permission to delete this cursor",
      );
    }

    try {
      await db.transaction(async (tx) => {
        await tx.delete(cursorLike).where(eq(cursorLike.cursorId, id));
        await tx.delete(cursorDownload).where(eq(cursorDownload.cursorId, id));
        await tx.delete(cursor).where(eq(cursor.id, id));
      });

      const coverService = new CoverUploadService();
      const fileService = new CursorFileUploadService();

      Promise.all([
        coverService.deleteCover(c.previewImage),
        fileService.deleteFile(c.fileUrl),
      ]).catch((err) => console.error("Error deleting files:", err));

      return { success: true };
    } catch (error) {
      console.error(error);
      throw AppError.internal("Error deleting cursor");
    }
  });
