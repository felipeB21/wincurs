"use client";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function UserCursor({ username }: { username: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.cursor.user({ username }).get();
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (data?.message)
    return (
      <p className="flex items-center justify-center h-[50dvh] text-sm text-gray-300">
        {data.message}.
      </p>
    );
  if (isError || data?.error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="grid grid-cols-3 justify-between">
      {data?.cursors?.map((cursor) => (
        <Link href={`/cursor/${cursor.id}`} key={cursor.id}>
          <Image
            src={cursor.previewImage}
            alt="Preview Image"
            width={100}
            height={100}
            className="rounded-md w-auto h-auto"
            priority
          />
          <h1>{cursor.name}</h1>
        </Link>
      ))}
    </div>
  );
}
