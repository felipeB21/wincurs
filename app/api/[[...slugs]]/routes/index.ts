import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { errorHandler } from "../middleware/error-handler";
import { securityMiddleware } from "../middleware/security";
import { cursorRoutes } from "./cursor";
import { profileRoutes } from "./profile";

import { usersRoutes } from "./users";

/**
 * Main API router that composes all routes with shared middleware.
 */
export const apiRoutes = new Elysia({ prefix: "/api" })
  // CORS configuration
  .use(
    cors({
      credentials: true,
      origin: [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "https://inextricable-stefanie-philately.ngrok-free.dev",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
  )
  // Core middleware
  .use(errorHandler)
  .use(securityMiddleware)
  // Routes
  .use(profileRoutes)
  .use(cursorRoutes)
  .use(usersRoutes);

export type ApiRoutes = typeof apiRoutes;
