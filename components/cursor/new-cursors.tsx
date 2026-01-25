"use client";

import { SunHorizonIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { cursorKeys, fetchCursors } from "@/features/cursor";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { CursorCard } from "./card";
import { Suspense } from "react";

function useCursorsPreview(limit = 4) {
  return useSuspenseQuery({
    queryKey: cursorKeys.preview(limit),
    queryFn: () => fetchCursors({ limit, offset: 0 }),
  });
}

export default function NewCursors() {
  return (
    <section className="flex flex-col gap-6 w-full">
      <header className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-pretty lg:text-6xl">
          New Cursors
        </h2>
        <SunHorizonIcon size={42} />
      </header>

      <div className="w-full">
        <Suspense fallback={<CursorsSkeleton />}>
          <CursorsList />
        </Suspense>
      </div>
    </section>
  );
}

function CursorsList() {
  const { data } = useCursorsPreview();
  const cursors = data?.cursors ?? [];

  if (cursors.length === 0) {
    return <p className="text-sm text-gray-300">No cursors yet.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {cursors.map((c) => (
          <CursorCard key={c.id} cursor={c} />
        ))}
      </div>
      <Button asChild className="w-full" size={"lg"}>
        <Link href="/cursor/newest">View More</Link>
      </Button>
    </div>
  );
}

function CursorsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full" />
      ))}
    </div>
  );
}
