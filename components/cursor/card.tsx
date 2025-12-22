"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CrownSimpleIcon,
  DownloadSimpleIcon,
  HeartIcon,
} from "@phosphor-icons/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export interface CursorCardProps {
  cursor: {
    id: string;
    name: string;
    previewImage: string;
    downloads: number;
    likes: number;
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
  } = cursor;

  return (
    <Link
      href={`/cursor/${id}`}
      className="group block rounded-md p-4 hover:bg-gray-700/20 transition border"
    >
      <div className="relative aspect-square w-48 overflow-hidden rounded-md bg-gray-800">
        <Image
          src={previewImage}
          alt={name}
          fill
          className="object-contain"
          sizes="1000px"
          loading="eager"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <h3 className="font-semibold truncate max-w-30">{name}</h3>

        <div className="flex items-center gap-3 text-sm text-gray-300">
          <span className="flex items-center gap-1">
            <DownloadSimpleIcon size={14} />
            {downloads}
          </span>
          <span className="flex items-center gap-1">
            <HeartIcon size={14} />
            {likes}
          </span>
        </div>
      </div>

      <div
        className="mt-2 flex items-center gap-2 w-max"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = `/profile/${username}`;
        }}
      >
        <Image
          src={userImage as string}
          alt="Avatar"
          width={32}
          height={32}
          className="rounded-full"
        />

        <div className="leading-none">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{userName}</span>

            {userTier === "premium" && (
              <Tooltip>
                <TooltipTrigger>
                  <CrownSimpleIcon size={14} weight="fill" color="#FFD700" />
                </TooltipTrigger>
                <TooltipContent>Premium</TooltipContent>
              </Tooltip>
            )}
          </div>

          <span className="text-xs text-primary font-bold">@{username}</span>
        </div>
      </div>
    </Link>
  );
}
