"use client";
import { CursorCard } from "@/components/cursor/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { FireIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

export default function PopularPage() {
  const title = "Popular";
  const icon = <FireIcon size={42} />;
  const limit = 12;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cursors-preview"],
    queryFn: () => api.cursor.popular.get({ query: { limit, offset: 0 } }),
  });
  const cursors = data?.data?.cursors ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{title}</h2>
        {icon}
      </div>

      <div className="w-full">
        {isLoading && (
          <div className="flex gap-6 col-span-full">
            <Skeleton className="w-48 h-48" />
            <Skeleton className="w-48 h-48" />
            <Skeleton className="w-48 h-48" />
          </div>
        )}

        {isError && (
          <p className="col-span-full text-red-500">
            There was an error fetching the cursors
          </p>
        )}

        {!isLoading && !isError && cursors.length === 0 && (
          <p className="col-span-full text-sm text-gray-300">No cursors yet.</p>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-4 gap-5">
            {cursors.map((c) => (
              <CursorCard key={c.id} cursor={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
