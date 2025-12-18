"use server";

import CursorIdClient from "@/components/cursor/cursor-id-client";

export default async function CursorIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CursorIdClient id={id} />;
}
