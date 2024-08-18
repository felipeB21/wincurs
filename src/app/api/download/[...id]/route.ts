import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {
    if (!params.id || params.id.length === 0) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const id = params.id[0];
    const userId = req.headers.get("user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if the user has already downloaded the cursor
    const existingDownload = await db.userDownload.findUnique({
      where: {
        userId_cursorId: {
          userId,
          cursorId: id,
        },
      },
    });

    if (existingDownload) {
      return NextResponse.json(
        { message: "Download already recorded" },
        { status: 200 }
      );
    }

    await db.userDownload.create({
      data: {
        userId,
        cursorId: id,
      },
    });

    const updatedCursor = await db.cursor.update({
      where: { id },
      data: {
        download_count: {
          increment: 1,
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

    return NextResponse.json(updatedCursor);
  } catch (error) {
    console.error("Error updating download count:", error);
    return NextResponse.json(
      { error: "Failed to update download count" },
      { status: 500 }
    );
  }
}
