import { Elysia, t } from "elysia";
import { db } from "@/db";
import { user, cursor, cursorLike, cursorDownload } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const usersRoutes = new Elysia({ prefix: "/users" })
  .get(
    "/top-creators",
    async ({ query }) => {
      const limit = query.limit;

      const topCreators = await db
        .select({
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
          tier: user.tier,
          cursorCount: sql<number>`count(distinct ${cursor.id})::int`,
          totalLikes: sql<number>`count(distinct ${cursorLike.id})::int`,
          totalDownloads: sql<number>`count(distinct ${cursorDownload.id})::int`,
          score: sql<number>`(
            count(distinct ${cursorLike.id}) + 
            count(distinct ${cursorDownload.id})
          )::int`,
        })
        .from(user)
        .leftJoin(cursor, eq(user.id, cursor.userId))
        .leftJoin(cursorLike, eq(cursor.id, cursorLike.cursorId))
        .leftJoin(cursorDownload, eq(cursor.id, cursorDownload.cursorId))
        .groupBy(user.id)
        .orderBy(desc(sql`
          (
            count(distinct ${cursorLike.id}) + 
            count(distinct ${cursorDownload.id})
          )
        `))
        .limit(limit);

      return { creators: topCreators };
    },
    {
      query: t.Object({
        limit: t.Number({ default: 10 }),
      }),
    }
  );
