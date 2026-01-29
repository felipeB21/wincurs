import { Suspense } from "react";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import {
  cursorKeys,
  fetchCursor,
  fetchRelatedCursors,
} from "@/features/cursor";
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
    const title = `${cursor.name} - Custom Cursor Download`;
    const description = `Download the ${cursor.name} custom cursor by ${cursor.userName} for Windows. ${cursor.description || "Free custom cursor download for Windows 10/11."}`;

    return {
      title,
      description: description.slice(0, 155),
      keywords: [
        "custom cursor",
        "windows cursor",
        "mouse pointer",
        "cursor download",
        "wincurs",
        cursor.name,
        cursor.userName,
        "windows 10 cursor",
        "windows 11 cursor",
      ],
      openGraph: {
        title,
        description: description.slice(0, 155),
        type: "website",
        url: `https://wincurs.com/cursor/${cursor.id}`,
        siteName: "Wincurs",
        images: cursor.previewImage
          ? [
              {
                url: cursor.previewImage,
                width: 1200,
                height: 630,
                alt: `${cursor.name} custom cursor preview`,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: description.slice(0, 155),
        images: cursor.previewImage ? [cursor.previewImage] : [],
      },
      alternates: {
        canonical: `https://wincurs.com/cursor/${cursor.id}`,
      },
    };
  } catch {
    return {
      title: "Cursor Not Found - Wincurs",
      description:
        "The requested custom cursor could not be found via Wincurs.",
    };
  }
}

export default async function CursorIdPage({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();

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
