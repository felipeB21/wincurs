"use client";

import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DownloadSimpleIcon, HeartIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";

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
    <div className="flex flex-col gap-5">
      <Image
        src={cursorData.previewImage}
        alt={cursorData.name}
        width={100}
        height={100}
        className="rounded-md w-100 h-100 object-contain"
        loading="eager"
      />
      <div>
        <h1 className="text-3xl font-bold">{cursorData.name}</h1>
        <p className="text-gray-300">{cursorData.description}</p>
      </div>
      <div className="flex items-center gap-5">
        <a
          href={cursorData.fileUrl}
          rel="noopener noreferrer"
          className="w-max"
        >
          <Tooltip>
            <TooltipTrigger className="w-max cursor-pointer ">
              <DownloadSimpleIcon size={20} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
        </a>
        <Button asChild className="w-max">
          <Tooltip>
            <TooltipTrigger className="w-max cursor-pointer ">
              <HeartIcon size={20} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Like</p>
            </TooltipContent>
          </Tooltip>
        </Button>
      </div>
    </div>
  );
}
