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
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  image: string;
  name: string;
  username: string;
};

export default function EditProfileClient({ image }: Props) {
  const [selected, setSelected] = useState(image);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const avatars = Array.from({ length: 6 }).map(
    (_, i) =>
      `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=avatar-${i}`
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Avatar</DialogTitle>
          <DialogDescription>Select an avatar</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          {avatars.map((url) => (
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

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await updateAvatar(selected);
                router.refresh(); // 🔥 refresca la session
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
