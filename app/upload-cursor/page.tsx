"use client";
import UploadCursor from "@/components/cursor/upload";
import { CursorClickIcon } from "@phosphor-icons/react";

export default function UploadCursorPage() {
  const title = "Upload Cursor";
  const description = "Upload a cursor";
  const icon = <CursorClickIcon size={42} />;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{title}</h2>
        {icon}
      </div>
      <p className="max-w-3xl text-muted-foreground lg:text-xl">
        {description}
      </p>
      <UploadCursor />
    </div>
  );
}
