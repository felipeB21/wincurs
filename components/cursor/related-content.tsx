"use client";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { CursorCard } from "./card";

export default function RelatedContent({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: ["related-cursors"],
    queryFn: () => api.cursor.related({ id }).get(),
  });

  return (
    <aside className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">
        Related cursors
      </h3>

      <ul className="space-y-3">
        <li className="flex flex-col items-center gap-3">
          {data?.data?.map((cursor) => (
            <CursorCard key={cursor.id} cursor={cursor} />
          ))}
        </li>
      </ul>
    </aside>
  );
}
