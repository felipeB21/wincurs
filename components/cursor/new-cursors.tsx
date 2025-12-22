"use client";

import {
  CrownSimpleIcon,
  DownloadSimpleIcon,
  HeartIcon,
  SunHorizonIcon,
} from "@phosphor-icons/react";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function NewCursors() {
  const title = "New Cursors";
  const icon = <SunHorizonIcon size={42} />;

  const limit = 6;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cursors-preview"],
    queryFn: () => api.cursor.desc.get({ query: { limit, offset: 0 } }),
  });
  const cursors = data?.data?.cursors ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{title}</h2>
        {icon}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 justify-between w-full">
        {isLoading && (
          <div className="flex gap-6 col-span-full">
            <Skeleton className="w-48 h-48" />
            <Skeleton className="w-48 h-48" />
            <Skeleton className="w-48 h-48" />
          </div>
        )}

        {isError && (
          <p className="col-span-full text-red-500">
            There was an error fetching the cursors
          </p>
        )}

        {!isLoading && !isError && cursors.length === 0 && (
          <p className="col-span-full text-sm text-gray-300">No cursors yet.</p>
        )}

        {!isLoading && !isError && (
          <div className="flex items-center justify-between">
            {cursors.map((c) => (
              <Link
                href={`/cursor/${c.id}`}
                key={c.id}
                className="group block rounded-md p-4 hover:bg-gray-700/20 transition"
              >
                <div className="relative aspect-square w-48 overflow-hidden rounded-md bg-gray-800">
                  <Image
                    src={c.previewImage}
                    alt={c.name}
                    fill
                    className="object-contain"
                    sizes="1000px"
                    loading="eager"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <h3 className="font-semibold truncate max-w-30">{c.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <DownloadSimpleIcon size={14} />
                      {c.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <HeartIcon size={14} />
                      {c.likes}
                    </span>
                  </div>
                </div>

                <div
                  className="mt-2 flex items-center gap-2 w-max"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/profile/${c.username}`;
                  }}
                >
                  <Image
                    src={c.userImage as string}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                    loading="eager"
                  />

                  <div className="leading-none">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium m-0">
                        {c.userName}
                      </span>
                      {c.userTier === "premium" && (
                        <Tooltip>
                          <TooltipTrigger>
                            <CrownSimpleIcon
                              size={14}
                              weight="fill"
                              color="#FFD700"
                            />
                          </TooltipTrigger>
                          <TooltipContent>Premium</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <span className="text-xs text-primary font-bold">
                      @{c.username}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            <Button className="flex items-center justify-center" asChild>
              <Link href={"/cursor/newest"}>View More</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
