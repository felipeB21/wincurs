"use client";

import Link from "next/link";
import { SignInDialog, SignUpDialog } from "./auth-dialog";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CrownSimpleIcon } from "@phosphor-icons/react";

type Props = {
  user?: {
    name: string | null;
    username?: string | null;
    image: string | null;
    tier: string | null;
  };
};

export default function NavSession({ user }: Props) {
  return (
    <div>
      {user ? (
        <Link
          href={`/profile/${user.username}`}
          className="w-full flex items-center gap-2 hover:bg-gray-700/10 rounded p-2"
        >
          <Image
            src={user.image as string}
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover h-8 w-8"
          />
          <div className="flex flex-col items-start leading-none">
            <div className="flex items-center gap-1">
              <h1 className="text-sm m-0">{user.name}</h1>
              {user.tier === "premium" ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CrownSimpleIcon
                        size={14}
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
              ) : null}
            </div>
            <span className="text-[10px] text-primary font-bold m-0">
              @{user.username}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex flex-col gap-2">
          <SignInDialog />
          <SignUpDialog />
        </div>
      )}
    </div>
  );
}
