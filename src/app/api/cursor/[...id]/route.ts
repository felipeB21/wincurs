import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idAt = params.id.at(0);

    const cursor = await db.cursor.findUnique({
      where: { id: idAt },
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

    if (!cursor) {
      return NextResponse.json({ error: "Cursor not found" }, { status: 404 });
    }

    return NextResponse.json(cursor);
  } catch (error) {
    console.error("Error fetching cursor:", error);
    return NextResponse.json(
      { error: "Failed to fetch cursor" },
      { status: 500 }
    );
  }
}
