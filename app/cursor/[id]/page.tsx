"use server";

import CursorIdClient from "@/components/cursor/cursor-id-client";
import RelatedContent from "@/components/cursor/related-content";
import { Separator } from "@/components/ui/separator";

export default async function CursorIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="grid grid-cols-[1fr_auto_320px] gap-6 h-full">
      <div className="min-w-0">
        <CursorIdClient id={id} />
      </div>
      <Separator orientation="vertical" />
      <RelatedContent />
    </div>
  );
}
