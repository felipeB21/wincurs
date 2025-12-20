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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{title}</h2>
        {icon}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 justify-between w-full">
        {isLoading && (
          <div className="flex items-center gap-20 justify-between">
            <Skeleton className="w-100 h-50" />
            <Skeleton className="w-100 h-50" />
            <Skeleton className="w-100 h-50" />
          </div>
        )}
        {isError && <p>Error al cargar cursors</p>}
        {data?.data?.cursors.map((c) => (
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

      <div className="mt-4 flex items-center justify-center">
        <Button asChild size={"lg"} className="w-50">
          <Link href="/cursor/newest">View More</Link>
        </Button>
      </div>
    </div>
  );
}
