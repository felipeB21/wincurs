"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { CursorCard } from "@/components/cursor/card";

export interface SearchCursor {
  id: string;
  name: string;
  previewImage: string;
  createdAt: Date;

  userId: string;
  userName: string;
  username: string;
  userImage: string | null;
  userTier: "free" | "premium";

  likes: number;
  downloads: number;
}

type SearchResponse = {
  cursors: SearchCursor[];
  hasMore: boolean;
  nextOffset: number;
};

async function searchCursors(query: string): Promise<SearchResponse> {
  if (!query.trim()) {
    return {
      cursors: [],
      hasMore: false,
      nextOffset: 0,
    };
  }

  const { data, error } = await api.cursor.search.get({
    query: {
      q: query,
      limit: 6,
      offset: 0,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export default function SearchClient() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search-cursors", search],
    queryFn: () => searchCursors(search),
    enabled: search.trim().length > 0,
    staleTime: 1000 * 30,
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for cursors..."
        className="h-12 text-base"
      />

      {isLoading && <p className="mt-5">Searching...</p>}
      {isError && <p className="mt-5">Error searching for cursor</p>}

      <div className="grid grid-cols-2 gap-4 mt-5">
        {data?.cursors.map((cursor) => (
          <CursorCard key={cursor.id} cursor={cursor} />
        ))}
      </div>

      {search && data?.cursors.length === 0 && (
        <p className="text-gray-500 mt-4">
          No results found of{" "}
          <span className="font-bold">&apos;{search}&apos;</span>
        </p>
      )}
    </div>
  );
}
