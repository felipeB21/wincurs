// src/app/api/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "../../../../../auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const id = params.id[0]; // Access the first element of the array directly

  try {
    const cursor = await db.cursor.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!cursor) {
      return NextResponse.json({ error: "Cursor not found" }, { status: 404 });
    }

    if (cursor.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const deleteFileResponse = await cloudinary.uploader.destroy(
      `${cursor.id}_${cursor.name}_file`,
      {
        resource_type: "raw",
      }
    );
    console.log("File deletion response:", deleteFileResponse);

    const deleteCoverResponse = await cloudinary.uploader.destroy(
      `${cursor.id}_${cursor.name}_cover`,
      {
        resource_type: "image",
      }
    );
    console.log("Cover deletion response:", deleteCoverResponse);

    await db.cursor.delete({ where: { id } });

    return NextResponse.json({ msg: "Cursor deleted successfully" });
  } catch (error) {
    console.error("Error deleting cursor:", error);
    return NextResponse.json(
      { error: "Failed to delete cursor" },
      { status: 500 }
    );
  }
}
