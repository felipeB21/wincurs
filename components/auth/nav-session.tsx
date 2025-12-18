"use client";

import Link from "next/link";
import { SignInDialog, SignUpDialog } from "./auth-dialog";
import Image from "next/image";

type Props = {
  user?: {
    name: string | null;
    username?: string | null;
    image: string | null;
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
            className="rounded-full object-cover"
          />
          <div className="flex flex-col items-start leading-none">
            <p className="text-sm m-0">{user.name}</p>
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
