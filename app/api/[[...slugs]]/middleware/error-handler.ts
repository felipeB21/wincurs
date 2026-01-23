import { Elysia } from "elysia";

/**
 * Custom application error for consistent error responses.
 * Use this to throw errors with specific status codes and error codes.
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(message: string, code = "BAD_REQUEST") {
    return new AppError(400, code, message);
  }

  static unauthorized(message = "Unauthorized", code = "UNAUTHORIZED") {
    return new AppError(401, code, message);
  }

  static forbidden(message = "Forbidden", code = "FORBIDDEN") {
    return new AppError(403, code, message);
  }

  static notFound(message = "Not found", code = "NOT_FOUND") {
    return new AppError(404, code, message);
  }

  static internal(message = "Internal server error", code = "INTERNAL_ERROR") {
    return new AppError(500, code, message);
  }
}

/**
 * Centralized error handling middleware for ElysiaJS.
 * Provides consistent error response format across all routes.
 */
export const errorHandler = new Elysia({ name: "error-handler" })
  .error({ APP_ERROR: AppError })
  .onError(({ error, code, set }) => {
    const timestamp = new Date().toISOString();

    // Handle custom AppError
    if (code === "APP_ERROR") {
      set.status = error.statusCode;
      return {
        error: error.message,
        code: error.code,
        timestamp,
      };
    }

    // Handle Elysia validation errors
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        timestamp,
      };
    }

    // Handle not found
    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        error: "Route not found",
        code: "NOT_FOUND",
        timestamp,
      };
    }

    // Log unexpected errors in development
    if (process.env.NODE_ENV !== "production") {
      console.error(`[ERROR ${code}]`, error);
    }

    // Default to internal server error
    set.status = 500;
    return {
      error: "Internal server error",
      code: "INTERNAL_ERROR",
      timestamp,
    };
  });
