"use client";

import { SunHorizonIcon } from "@phosphor-icons/react";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function NewCursors() {
  const title = "New Cursors";
  const icon = <SunHorizonIcon size={42} />;

  const limit = 6;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cursors-preview"],
    queryFn: () => api.cursor.desc.get({ query: { limit, offset: 0 } }),
  });
  const cursors = data?.data?.cursors ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{title}</h2>
        {icon}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 justify-between w-full">
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

        {!isLoading &&
          !isError &&
          cursors.map((c) => (
            <Link href={`/cursor/${c.id}`} key={c.id} className="w-max">
              <Image
                src={c.previewImage}
                alt={c.name}
                width={200}
                height={200}
                className="rounded-md"
              />
            </Link>
          ))}
      </div>
    </div>
  );
}
