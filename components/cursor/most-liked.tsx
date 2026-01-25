"use client";
import { HeartIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { cursorKeys, cursorQueryOptions, fetchCursors } from "@/features/cursor";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { CursorCard } from "./card";
import { Suspense } from "react";

function useCursorsPreview(limit = 4) {
  return useSuspenseQuery(
    cursorQueryOptions.mostLiked(limit)
  );
}

export default function MostLikedCursors() {
  const title = "Most Liked";
  const icon = <HeartIcon size={42} />;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{title}</h2>
        {icon}
      </div>

      <div className="w-full">
        <Suspense fallback={<CursorsSkeleton />}>
          <CursorsList />
        </Suspense>
      </div>
    </div>
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
        <Link href="/cursor/most-liked">View More</Link>
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