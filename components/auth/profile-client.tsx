"use client";

import NotFound from "@/app/not-found";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { CrownSimpleIcon, DotsThreeVerticalIcon } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SignOut from "./sign-out";
import UserCursor from "../cursor/user-cursor";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";

export default function ProfileClient({
  username,
  isOwner,
}: {
  username: string;
  isOwner: boolean;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["user", username],
    queryFn: () => api.profile({ username }).get(),
  });

  if (isLoading)
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-50" />
          <Skeleton className="h-2 w-28" />
        </div>
      </div>
    );

  if (!data?.data || "error" in data.data) {
    return <NotFound />;
  }

  const user = data.data;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user.image && (
            <Image
              src={user.image}
              alt={user.username}
              width={128}
              height={128}
              className="w-24 h-24 object-cover rounded-full"
              loading="eager"
            />
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              {user.tier === "premium" ? (
                <Tooltip>
                  <TooltipTrigger>
                    <CrownSimpleIcon size={28} weight="fill" color="#FFD700" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Premium</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
            <p className="text-sm text-primary">@{username}</p>
          </div>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"secondary"} size={"icon-lg"}>
                <DotsThreeVerticalIcon size={42} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup className="flex flex-col gap-1">
                <DropdownMenuItem asChild>
                  <Button variant={"outline"} asChild>
                    <Link href={"/settings"}>Settings</Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <SignOut />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <Separator className="my-5" />
      <UserCursor username={username} />
    </div>
  );
}
