"use client";

import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function CursorIdClient({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cursor-id", id],
    queryFn: () => api.cursor({ id }).get(),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error)?.message}</p>;
  if (!data?.data) return <p>No data returned</p>;

  const cursorData = data.data;

  if ("message" in cursorData) {
    return <p>{cursorData.message}</p>;
  }

  return (
    <div>
      <p>ID: {cursorData.id}</p>
      <p>Name: {cursorData.name}</p>
      <Image
        src={cursorData.previewImage}
        alt={cursorData.name}
        width={100}
        height={100}
        loading="eager"
      />
      <a href={cursorData.fileUrl} rel="noopener noreferrer">
        Download Cursor
      </a>
    </div>
  );
}
