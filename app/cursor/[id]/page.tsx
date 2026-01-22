import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import CursorIdClient from "@/components/cursor/cursor-id-client";
import RelatedContent from "@/components/cursor/related-content";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

const getCursor = cache(async (id: string) => {
  const res = await api.cursor({ id }).get();
  const cursor = res.data;

  if (!cursor || "message" in cursor) return null;
  return cursor;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cursor = await getCursor(id);

  if (!cursor) {
    return { title: "Cursor Not Found - wincurs" };
  }

  return {
    title: `${cursor.name} - wincurs`,
    description: `Download ${cursor.name} by ${cursor.userName}. ${cursor.description}`,
  };
}

export default async function CursorIdPage({ params }: Props) {
  const { id } = await params;

  // 2. Ejecutar la búsqueda de datos lo antes posible
  const cursorDataPromise = getCursor(id);
  const cursor = await cursorDataPromise;

  if (!cursor) notFound();

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto_320px] gap-6 h-full">
      <main className="min-w-0 flex-1">
        <CursorIdClient id={id} initialData={cursor} />
      </main>

      <Separator orientation="vertical" className="hidden lg:block" />

      {/* 4. Streaming: El contenido relacionado carga de forma independiente */}
      <aside className="w-full lg:w-[320px]">
        <Suspense fallback={<RelatedContentSkeleton />}>
          <RelatedContent id={id} />
        </Suspense>
      </aside>
    </div>
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
