import { Elysia } from "elysia";
import { apiRoutes } from "./routes";

// Re-export the composed app for Eden type inference
export const app = new Elysia().use(apiRoutes);

export type App = typeof app;

// HTTP method handlers
export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
export const PATCH = app.fetch;
