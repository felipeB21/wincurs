import { Elysia } from "elysia";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cursorRoute } from "./cursor";

export const app = new Elysia({ prefix: "/api" })
  .get("/profile/:username", async ({ params, set }) => {
    const { username } = params;

    const result = await db
      .select({
        name: user.name,
        username: user.username,
        image: user.image,
        tier: user.tier,
      })
      .from(user)
      .where(eq(user.username, username))
      .limit(1);

    if (result.length === 0) {
      set.status = 404;
      return { error: "User not found" };
    }

    return result[0];
  })
  .use(cursorRoute);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
