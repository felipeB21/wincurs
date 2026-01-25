import { api } from "@/lib/api-client";
import type { Cursor, CursorFilters, CursorListResponse, CursorCard } from "./types";

// =============================================================================
// QUERY KEYS FACTORY
// =============================================================================

export const cursorKeys = {
  all: ["cursors"] as const,
  lists: () => [...cursorKeys.all, "list"] as const,
  list: (filters: CursorFilters) => [...cursorKeys.lists(), filters] as const,
  details: () => [...cursorKeys.all, "detail"] as const,
  detail: (id: string) => [...cursorKeys.details(), id] as const,
  preview: (limit: number) => [...cursorKeys.all, "preview", limit] as const,
  related: (id: string) => [...cursorKeys.all, "related", id] as const,
  popular: (filters: CursorFilters) =>
    [...cursorKeys.all, "popular", filters] as const,
  search: (q: string, filters: CursorFilters) =>
    [...cursorKeys.all, "search", q, filters] as const,
  userCursors: (username: string) =>
    [...cursorKeys.all, "user", username] as const,
  mostLiked: (limit: number) => [...cursorKeys.all, "most-liked", limit] as const,
};

// =============================================================================
// API FUNCTIONS (Typed wrappers for Eden client)
// =============================================================================

// Helper to get auth headers for server-side requests
async function getAuthHeaders() {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    return { cookie: (await cookies()).toString() };
  }
  return {};
}

export async function fetchCursor(id: string): Promise<Cursor> {
  const headers = await getAuthHeaders();
  const res = await api.cursor({ id }).get({ headers });
  if (res.error) {
    throw new Error("Failed to fetch cursor");
  }
  const data = res.data;
  if (!data || "message" in data) {
    throw new Error("Cursor not found");
  }
  return data as Cursor;
}

export async function fetchCursors(params: {
  limit: number;
  offset: number;
}): Promise<CursorListResponse> {
  const headers = await getAuthHeaders();
  const res = await api.cursor.desc.get({ query: params, headers });
  if (res.error) {
    throw new Error("Failed to fetch cursors");
  }
  return res.data as CursorListResponse;
}

export async function fetchRelatedCursors(id: string): Promise<CursorCard[]> {
  const headers = await getAuthHeaders();
  const res = await api.cursor.related({ id }).get({ headers });
  if (res.error) {
    throw new Error("Failed to fetch related cursors");
  }
  return (res.data ?? []) as CursorCard[];
}

export async function fetchMostLikedCursors(params: {
  limit: number;
  offset: number;
}): Promise<CursorListResponse> {
  const headers = await getAuthHeaders();
  // Apuntamos a la ruta .mostLiked que definiste en Elysia
  const res = await api.cursor["most-liked"].get({ query: params, headers });
  
  if (res.error) {
    throw new Error("Failed to fetch most liked cursors");
  }
  return res.data as CursorListResponse;
}

export async function fetchPopularCursors(params: {
  limit: number;
  offset: number;
}): Promise<CursorListResponse> {
  const headers = await getAuthHeaders();
  const res = await api.cursor.popular.get({ query: params, headers });
  if (res.error) {
    throw new Error("Failed to fetch popular cursors");
  }
  return res.data as CursorListResponse;
}



export async function searchCursors(params: {
  q: string;
  limit: number;
  offset: number;
}): Promise<CursorListResponse> {
  const headers = await getAuthHeaders();
  const res = await api.cursor.search.get({ query: params, headers });
  if (res.error) {
    throw new Error("Failed to search cursors");
  }
  return res.data as CursorListResponse;
}

// =============================================================================
// QUERY OPTIONS (for use with React Query)
// =============================================================================

export const cursorQueryOptions = {
  detail: (id: string) => ({
    queryKey: cursorKeys.detail(id),
    queryFn: () => fetchCursor(id),
  }),

  preview: (limit: number) => ({
    queryKey: cursorKeys.preview(limit),
    queryFn: () => fetchCursors({ limit, offset: 0 }),
  }),

  related: (id: string) => ({
    queryKey: cursorKeys.related(id),
    queryFn: () => fetchRelatedCursors(id),
    staleTime: 1000 * 60 * 5, // 5 minutes - related content changes less
  }),

  popular: (filters: CursorFilters) => ({
    queryKey: cursorKeys.popular(filters),
    queryFn: () =>
      fetchPopularCursors({
        limit: filters.limit ?? 20,
        offset: filters.offset ?? 0,
      }),
  }),

  mostLiked: (limit: number) => ({
    queryKey: cursorKeys.mostLiked(limit),
    queryFn: () => fetchMostLikedCursors({ limit, offset: 0 }),
  }),


  search: (q: string, filters: CursorFilters) => ({
    queryKey: cursorKeys.search(q, filters),
    queryFn: () =>
      searchCursors({
        q,
        limit: filters.limit ?? 10,
        offset: filters.offset ?? 0,
      }),
    enabled: q.trim().length > 0,
  }),
};
