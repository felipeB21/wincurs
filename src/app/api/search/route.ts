import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ cursors: [] });
  }

  const cursors = await db.cursor.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: { id: true, name: true, cover: true },
  });

  return NextResponse.json({ cursors });
}
