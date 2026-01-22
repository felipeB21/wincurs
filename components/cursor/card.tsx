"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CrownSimpleIcon,
  DownloadSimpleIcon,
  HeartIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export interface CursorCardProps {
  cursor: {
    id: string;
    name: string;
    previewImage: string;
    downloads: number;
    likes: number;
    createdAt: Date;
    username: string;
    userName: string;
    userImage: string | null;
    userTier: "free" | "premium";
  };
}

export function CursorCard({ cursor }: CursorCardProps) {
  const {
    id,
    name,
    previewImage,
    downloads,
    likes,
    username,
    userName,
    userImage,
    userTier,
    createdAt,
  } = cursor;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let raf = 0;
    raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="group w-full relative rounded-xl border border-white/10 bg-gray-900/50 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-gray-800/80 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
      <Link
        href={`/cursor/${id}`}
        className="relative block aspect-square w-full overflow-hidden rounded-lg bg-gray-950"
      >
        <Image
          src={previewImage || ""}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="eager"
          quality={75}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black">
            View Details <ArrowUpRightIcon size={14} weight="bold" />
          </div>
        </div>
      </Link>

      <div className="mt-4 px-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white transition-colors group-hover:text-primary">
              {name}
            </h3>
            <div className="text-gray-300 text-[11px] flex items-center gap-1">
              <p>Created on</p>
              <span className="font-bold">
                {mounted ? format(new Date(createdAt), "MMM d, yyyy") : "---"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
            <span className="flex items-center gap-1">
              <DownloadSimpleIcon size={14} className="text-gray-500" />
              {downloads.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <HeartIcon size={14} className="text-gray-500" />
              {likes.toLocaleString()}
            </span>
          </div>
        </div>

        <hr className="my-3 border-white/5" />

        <Link
          href={`/profile/${username}`}
          className="flex items-center gap-2.5 rounded-lg p-1 transition-colors hover:bg-white/5"
        >
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-transparent transition-all group-hover:ring-white/10">
            <Image
              src={userImage || "/default-avatar.png"}
              alt={userName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="flex min-w-0 flex-col leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-xs font-semibold text-gray-200">
                {userName}
              </span>
              {userTier === "premium" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CrownSimpleIcon
                        size={12}
                        weight="fill"
                        className="text-yellow-400"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-yellow-400 text-[10px] font-bold text-black"
                    >
                      PREMIUM AUTHOR
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <span className="text-[10px] text-gray-500">@{username}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
