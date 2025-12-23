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
  .post("/polar/webhook", async ({ request, set }) => {
    const body = await request.json();
    const signature = request.headers.get("polar-signature");

    if (!signature) {
      set.status = 400;
      return { error: "Missing signature" };
    }

    const event = body;

    switch (event.type) {
      case "subscription.created":
      case "subscription.active": {
        const userId = event.data.customer.metadata.userId;

        await db
          .update(user)
          .set({ tier: "premium" })
          .where(eq(user.id, userId));
        break;
      }

      case "subscription.canceled":
      case "subscription.expired": {
        const userId = event.data.customer.metadata.userId;

        await db.update(user).set({ tier: "free" }).where(eq(user.id, userId));
        break;
      }
    }

    return { ok: true };
  })
  .use(cursorRoute);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
