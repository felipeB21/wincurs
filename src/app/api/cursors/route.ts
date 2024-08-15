import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const cursors = await db.cursor.findMany({
      include: { user: true },
    });

    if (!cursors || cursors.length === 0) {
      return NextResponse.json({ msg: "No cursors found" });
    }

    return NextResponse.json(cursors);
  } catch (error) {
    console.error("Error fetching cursors:", error);
    return NextResponse.json({ msg: "Error fetching cursors", error });
  }
}
