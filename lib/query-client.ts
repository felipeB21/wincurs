import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

/**
 * Server-side QueryClient factory using React's cache() for request-level deduplication.
 * Each request gets its own QueryClient instance, but within a single request,
 * the same instance is reused (important for prefetching in Server Components).
 */
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60, // 1 minute
        },
      },
    })
);
