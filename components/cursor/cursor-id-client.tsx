"use client";

import { api } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  CrownSimpleIcon,
  DownloadSimpleIcon,
  HeartIcon,
} from "@phosphor-icons/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Cursor } from "@/interface/ICursor";
import CursorIdSkeleton from "./cursor-id-skeleton";
import { format } from "date-fns";
import { Separator } from "../ui/separator";

interface ElysiaErrorResponse {
  message?: string;
  summary?: string;
  type?: string;
}

interface CursorResponse {
  data: Cursor | { message: string } | null;
}

export default function CursorIdClient({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cursor-id", id],
    queryFn: () => api.cursor({ id }).get(),
  });

  const likeMutation = useMutation({
    mutationFn: () => api.cursor({ id }).like.post(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cursor-id", id] });

      const previousData = queryClient.getQueryData<CursorResponse>([
        "cursor-id",
        id,
      ]);

      queryClient.setQueryData<CursorResponse>(["cursor-id", id], (old) => {
        if (!old?.data || "message" in old.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            likes: old.data.likedByUser
              ? old.data.likes - 1
              : old.data.likes + 1,
            likedByUser: !old.data.likedByUser,
          },
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["cursor-id", id], context?.previousData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cursor-id", id] });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const res = await api.cursor({ id }).download.post();
      if (res.error) {
        const errorData = res.error.value as unknown as ElysiaErrorResponse;

        const errorMessage =
          errorData.message || errorData.summary || "Failed to download";

        throw new Error(errorMessage);
      }
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.fileUrl) {
        const link = document.createElement("a");
        link.href = data.fileUrl;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        queryClient.invalidateQueries({ queryKey: ["cursor-id", id] });
      }
    },
  });

  if (isLoading) return <CursorIdSkeleton />;
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
        width={1000}
        height={1000}
        className="w-auto h-100 object-contain"
        loading="eager"
      />
      <div>
        <div className="flex items-center gap-5">
          <h1 className="text-3xl font-bold">{cursorData.name}</h1>
          <Separator orientation="vertical" />
          <div className="flex items-center gap-1 text-xs text-gray-300">
            <span className="font-bold">Published: </span>
            <p>{format(new Date(cursorData.createdAt), "MMMM d, yyyy")}</p>
          </div>
        </div>
        <p className="text-gray-300">{cursorData.description}</p>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-300 font-bold">Created by</p>
          <Link
            href={`/profile/${cursorData.username}`}
            className="w-max flex items-center gap-2"
          >
            <Image
              src={cursorData.userImage as string}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full w-8 h-8"
              loading="eager"
            />
            <div className="flex flex-col items-start leading-none">
              <div className="flex items-center gap-1">
                <h5 className="text-sm m-0">{cursorData.userName}</h5>
                {cursorData.userTier === "premium" ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <CrownSimpleIcon
                        size={14}
                        weight="fill"
                        color="#FFD700"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Premium</p>
                    </TooltipContent>
                  </Tooltip>
                ) : null}
              </div>
              <span className="text-[10px] text-primary font-bold m-0">
                @{cursorData.username}
              </span>
            </div>
          </Link>
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => downloadMutation.mutate()}
                disabled={downloadMutation.isPending}
              >
                <DownloadSimpleIcon
                  size={20}
                  className={downloadMutation.isPending ? "animate-pulse" : ""}
                />
                {cursorData.downloads}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{downloadMutation.isPending ? "Preparing..." : "Download"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={cursorData.likedByUser ? "default" : "outline"}
                onClick={() => likeMutation.mutate()}
              >
                <HeartIcon
                  weight={cursorData.likedByUser ? "fill" : "regular"}
                  size={20}
                />
                {cursorData.likes}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {cursorData.likedByUser ? "Unlike" : "Like"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
