import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(req: Request) {
  const session = await auth();

  try {
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Sign in to upload your cursor" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const file = formData.get("file") as File;
    const cover = formData.get("cover") as File;

    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user || !name || !file || !cover) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }

    // Validar extensión del archivo
    const allowedExtensions = ["zip", "rar"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension || "")) {
      return NextResponse.json(
        { error: "Only .zip and .rar files are allowed" },
        { status: 400 }
      );
    }

    const bufferFromFile = async (file: File): Promise<Buffer> => {
      const arrayBuffer = await file.arrayBuffer();
      return Buffer.from(arrayBuffer);
    };

    const uploadStream = (
      buffer: Buffer,
      options: any
    ): Promise<UploadApiResponse> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          options,
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        Readable.from(buffer).pipe(stream);
      });
    };

    const coverBuffer = await bufferFromFile(cover);
    const fileBuffer = await bufferFromFile(file);

    const coverUploadResult = await uploadStream(coverBuffer, {
      folder: "cursors/covers",
      public_id: `${name}_${user.id}_cover`,
      resource_type: "image",
    });

    const fileUploadResult = await uploadStream(fileBuffer, {
      folder: "cursors/files",
      public_id: `${name}_${user.id}_file`,
      resource_type: "auto",
    });

    const savedCursor = await db.cursor.create({
      data: {
        name,
        file: fileUploadResult.secure_url,
        cover: coverUploadResult.secure_url,
        user: { connect: { id: user.id } },
      },
    });

    return NextResponse.json({
      msg: "Cursor uploaded successfully",
      data: savedCursor,
    });
  } catch (error) {
    console.error("Error uploading cursor:", error);
    return NextResponse.json(
      { error: "Failed to upload cursor" },
      { status: 500 }
    );
  }
}
