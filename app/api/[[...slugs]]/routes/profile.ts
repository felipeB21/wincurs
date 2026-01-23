import { Elysia } from "elysia";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../middleware/error-handler";

export const profileRoutes = new Elysia()
  .get("/profile/:username", async ({ params }) => {
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
      throw AppError.notFound("User not found");
    }

    return result[0];
  });
