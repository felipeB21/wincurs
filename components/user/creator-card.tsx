"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CrownSimpleIcon,
  HeartIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TopCreator } from "@/features/user/types";

interface CreatorCardProps {
  creator: TopCreator;
  rank: number;
}

export function CreatorCard({ creator, rank }: CreatorCardProps) {
  return (
    <Link href={`/profile/${creator.username}`}>
      <Card className="h-full hover:border-primary/50 transition-colors duration-300 overflow-hidden group">
        <CardContent className="p-6 flex flex-col items-center text-center gap-4 relative">
          <div className="absolute top-4 left-4">
            <Badge
              variant={rank <= 3 ? "default" : "secondary"}
              className="text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full p-0"
            >
              #{rank}
            </Badge>
          </div>

          <div className="relative">
            <Image
              src={creator.image ?? "/fallback-avatar.png"}
              alt={creator.name ?? "User"}
              width={96}
              height={96}
              className="rounded-full ring-4 ring-muted group-hover:ring-primary/20 transition-all object-cover"
            />
            {creator.tier === "premium" && (
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm border">
                <CrownSimpleIcon
                  size={20}
                  weight="fill"
                  className="text-yellow-500"
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-lg truncate max-w-[200px]">
              {creator.name}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              @{creator.username}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full pt-2">
            <div className="flex flex-col items-center gap-1 bg-muted/30 p-2 rounded-lg">
              <HeartIcon size={18} className="text-red-500" weight="fill" />
              <span className="font-bold text-sm">{creator.totalLikes}</span>
              <span className="text-xs text-muted-foreground">Likes</span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-muted/30 p-2 rounded-lg">
              <DownloadSimpleIcon size={18} className="text-blue-500" weight="fill" />
              <span className="font-bold text-sm">
                {creator.totalDownloads}
              </span>
              <span className="text-xs text-muted-foreground">Downloads</span>
            </div>
          </div>
          
           <div className="w-full text-xs text-muted-foreground border-t pt-3 mt-1">
            <span className="font-medium text-foreground">{creator.cursorCount}</span> cursors published
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
