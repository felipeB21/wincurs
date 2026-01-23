import { Suspense } from "react";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { cursorKeys, fetchCursor, fetchRelatedCursors } from "@/features/cursor";
import CursorIdClient from "@/components/cursor/cursor-id-client";
import RelatedContent from "@/components/cursor/related-content";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const cursor = await fetchCursor(id);
    return {
      title: `${cursor.name} - wincurs`,
      description: `Download ${cursor.name} by ${cursor.userName}. ${cursor.description}`,
    };
  } catch {
    return { title: "Cursor Not Found - wincurs" };
  }
}

export default async function CursorIdPage({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();

  // Prefetch cursor data and related content in parallel
  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: cursorKeys.detail(id),
        queryFn: () => fetchCursor(id),
      }),
      queryClient.prefetchQuery({
        queryKey: cursorKeys.related(id),
        queryFn: () => fetchRelatedCursors(id),
      }),
    ]);
  } catch {
    notFound();
  }

  // Get the prefetched cursor to check if it exists
  const cursor = queryClient.getQueryData(cursorKeys.detail(id));
  if (!cursor) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto_320px] gap-6 h-full">
        <main className="min-w-0 flex-1">
          <CursorIdClient id={id} />
        </main>

        <Separator orientation="vertical" className="hidden lg:block" />

        <aside className="w-full lg:w-[320px]">
          <Suspense fallback={<RelatedContentSkeleton />}>
            <RelatedContent id={id} />
          </Suspense>
        </aside>
      </div>
    </HydrationBoundary>
  );
}

function RelatedContentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

