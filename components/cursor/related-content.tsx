"use client";

import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { CursorCard } from "./card";
import { Skeleton } from "../ui/skeleton";

export default function RelatedContent({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["cursors", "related", id],
    queryFn: () => api.cursor.related({ id }).get(),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const relatedCursors = data?.data ?? [];

  return (
    <aside className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Related cursors
      </h3>

      <ul className="flex flex-col gap-3">
        {isLoading ? (
          <RelatedSkeletons />
        ) : relatedCursors.length > 0 ? (
          relatedCursors.map((cursor) => (
            <li key={cursor.id}>
              <CursorCard cursor={cursor} />
            </li>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">
            No related cursors found.
          </p>
        )}
      </ul>
    </aside>
  );
}

function RelatedSkeletons() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <li key={i} className="flex flex-col gap-2">
          <Skeleton className="h-100 w-full rounded-xl" />
        </li>
      ))}
    </>
  );
}
