import CursorIdClient from "@/components/cursor/cursor-id-client";
import RelatedContent from "@/components/cursor/related-content";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api-client";
import type { Metadata } from "next";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cursorId = (await params).id;

  const res = await api.cursor({ id: cursorId }).get();

  const cursor = res.data;
  if (!cursor || "message" in cursor) {
    return {
      title: "Cursor Not Found - wincurs",
      description: "The requested cursor does not exist.",
    };
  }
  return {
    title: `${cursor.name} - wincurs`,
    description: `Download and explore the "${cursor.name}" cursor by ${cursor.userName}. ${cursor.description}`,
  };
}

export default async function CursorIdPage({ params }: Props) {
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
