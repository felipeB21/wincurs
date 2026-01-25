"use client";

import { useQuery } from "@tanstack/react-query";
import { cursorKeys, fetchRelatedCursors } from "@/features/cursor";
import { CursorCard } from "./card";
import { Skeleton } from "../ui/skeleton";

export default function RelatedContent({ id }: { id: string }) {
  const { data: relatedCursors = [], isLoading } = useQuery({
    queryKey: cursorKeys.related(id),
    queryFn: () => fetchRelatedCursors(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

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
