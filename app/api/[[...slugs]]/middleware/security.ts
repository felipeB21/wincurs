import { Elysia } from "elysia";

/**
 * Security middleware for ElysiaJS.
 * Adds security headers to all responses.
 */
export const securityMiddleware = new Elysia({ name: "security" })
  // Add security headers to all responses
  .onAfterHandle(({ set }) => {
    set.headers["X-Content-Type-Options"] = "nosniff";
    set.headers["X-Frame-Options"] = "DENY";
    set.headers["X-XSS-Protection"] = "1; mode=block";
    set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
  });

