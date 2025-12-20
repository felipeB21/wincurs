"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { updateAvatar } from "@/lib/auth-server";
import { LockIcon } from "@phosphor-icons/react";

type Props = {
  userId: string;
  image: string;
  name: string;
  username: string;
  tier?: "free" | "premium" | null;
};

export default function EditProfileClient({ image, tier }: Props) {
  const [selected, setSelected] = useState(image);
  const [pending, startTransition] = useTransition();

  const freeAvatars = Array.from({ length: 6 }).map(
    (_, i) =>
      `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=avatar-${i}`
  );

  const premiumAvatars = Array.from({ length: 6 }).map(
    (_, i) => `https://api.dicebear.com/9.x/thumbs/svg?seed=${i}`
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={selected}
          alt="Avatar"
          width={100}
          height={100}
          className="cursor-pointer rounded-full hover:opacity-50"
        />
      </DialogTrigger>

      <DialogContent className="max-h-[75vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            Change Avatar
          </DialogTitle>
          <DialogDescription>Select an avatar</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[50vh] pr-2">
          <h2 className="text-2xl font-bold mb-2">FREE</h2>
          <div className="grid grid-cols-3 gap-3">
            {freeAvatars.map((url) => (
              <Button
                asChild
                key={url}
                onClick={() => setSelected(url)}
                size={"icon"}
                className={`${
                  selected === url ? "border-5" : "border-transparent"
                }`}
              >
                <Image
                  src={url}
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="rounded-full w-auto h-auto"
                />
              </Button>
            ))}
          </div>
          <h2 className="text-2xl font-bold my-2">PREMIUM</h2>
          <div className="grid grid-cols-3 gap-3">
            {premiumAvatars.map((url) => {
              const isLocked = tier === "free";
              const isSelected = selected === url;

              return (
                <Button
                  key={url}
                  onClick={() => !isLocked && setSelected(url)}
                  size="icon"
                  variant="outline"
                  disabled={isLocked}
                  className={`relative h-auto w-auto p-1 ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={url}
                    alt="Avatar"
                    width={100}
                    height={100}
                    className={`rounded-full transition ${
                      isLocked ? "opacity-40" : "opacity-100"
                    }`}
                  />

                  {isLocked && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="rounded-full bg-black/60 p-2">
                        <LockIcon className="h-5 w-5 text-white" />
                      </span>
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await updateAvatar(selected);
                window.location.reload();
              })
            }
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
