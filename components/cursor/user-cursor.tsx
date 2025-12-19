"use client";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export default function UserCursor({ username }: { username: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.cursor.user({ username }).get();
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="columns-3 gap-3 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl border border-white/20 shadow-lg shadow-black/10"
          >
            <Skeleton className="w-full aspect-square" />

            <div className="absolute bottom-0 w-full px-4 py-3">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );

  if (data?.message)
    return (
      <p className="flex items-center justify-center h-[50dvh] text-sm text-gray-300">
        {data.message}.
      </p>
    );
  if (isError || data?.error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="columns-3 gap-3 space-y-3">
      {data?.cursors?.map((cursor) => (
        <Link
          key={cursor.id}
          href={`/cursor/${cursor.id}`}
          className="group relative block overflow-hidden rounded-xl border border-white/20 shadow-lg shadow-black/10"
        >
          <Image
            src={cursor.previewImage}
            alt="Preview Image"
            width={400}
            height={400}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]group-hover:brightness-75"
            loading="eager"
          />
          <div className=" shadow-lg shadow-black/10 pointer-events-none absolute inset-0 flex items-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="w-full bg-white/10 backdrop-blur-md px-4 py-3">
              <h1 className="text-sm font-semibold text-white">
                {cursor.name}
              </h1>
              <p className="text-xs text-white/90 line-clamp-2">
                {cursor.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
