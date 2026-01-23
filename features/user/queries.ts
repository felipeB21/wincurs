import { api } from "@/lib/api-client";
import type { TopCreatorsResponse } from "./types";

export const userKeys = {
  all: ["users"] as const,
  topCreators: (limit: number) => [...userKeys.all, "topCreators", limit] as const,
};

// Helper to get auth headers for server-side requests
async function getAuthHeaders() {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    return { cookie: (await cookies()).toString() };
  }
  return {};
}

export async function fetchTopCreators(
  limit: number = 20
): Promise<TopCreatorsResponse> {
  const headers = await getAuthHeaders();
  const res = await api.users["top-creators"].get({
    query: { limit },
    headers,
  });

  if (res.error) {
    throw new Error("Failed to fetch top creators");
  }

  return res.data as TopCreatorsResponse;
}
