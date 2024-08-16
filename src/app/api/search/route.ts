import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ cursors: [] });
  }

  try {
    const cursors = await db.cursor.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ cursors });
  } catch (error) {
    console.error("Error fetching cursors:", error);
    return NextResponse.json({ msg: "Error fetching cursors", error });
  }
}
