"use client";

import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export default function CursorIdClient({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["cursor-id", id],
    queryFn: () => api.cursor({ id }).get(),
  });
  console.log(data);

  return <div>CursorIdClient</div>;
}
