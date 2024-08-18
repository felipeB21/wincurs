import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {
    // Ensure params.id is an array and has at least one element
    if (!params.id || params.id.length === 0) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const id = params.id[0]; // Get the first part of the catch-all parameter

    const cursor = await db.cursor.findUnique({
      where: { id },
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
