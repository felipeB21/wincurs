"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { cursorKeys, fetchCursor } from "@/features/cursor";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import CursorIdSkeleton from "./cursor-id-skeleton";

import {
  CrownSimpleIcon,
  DownloadSimpleIcon,
  HeartIcon,
  TrashSimpleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

import type { Cursor } from "@/interface/ICursor";

interface Props {
  id: string;
}

export default function CursorIdClient({ id }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { data, isLoading } = useQuery({
    queryKey: cursorKeys.detail(id),
    queryFn: () => fetchCursor(id),
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await api.cursor({ id }).like.post();
      if (error) throw error;
      return data;
    },
    onMutate: async () => {
      if (!session) {
        return;
      }

      await queryClient.cancelQueries({ queryKey: cursorKeys.detail(id) });
      const previous = queryClient.getQueryData<Cursor>(cursorKeys.detail(id));

      if (previous) {
        queryClient.setQueryData<Cursor>(cursorKeys.detail(id), {
          ...previous,
          likes: previous.likedByUser ? previous.likes - 1 : previous.likes + 1,
          likedByUser: !previous.likedByUser,
        });
      }
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(cursorKeys.detail(id), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cursorKeys.detail(id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await api.cursor({ id }).delete.post();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: cursorKeys.detail(id) });
      router.push("/");
      router.refresh();
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const res = await api.cursor({ id }).download.post();
      if (res.error) throw new Error("Download failed");
      return res.data;
    },
    onSuccess: (resData) => {
      if (resData?.fileUrl) {
        const a = document.createElement("a");
        a.href = resData.fileUrl;
        a.download = "";
        a.click();
        queryClient.invalidateQueries({ queryKey: cursorKeys.detail(id) });
      }
    },
  });

  if (isLoading) return <CursorIdSkeleton />;
  if (!data) return <NotFoundState />;

  const isOwner = session?.user?.id === data.userId;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted/30">
        <Image
          src={data.previewImage}
          alt={data.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
          priority
          className="object-contain"
        />
      </div>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <p className="text-sm text-muted-foreground">
            Published {format(new Date(data.createdAt), "PPP")}
          </p>
        </div>
        <p className="text-muted-foreground w-full">{data.description}</p>
      </header>
      <Separator />
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <Link
          href={`/profile/${data.username}`}
          className="group flex items-center gap-3"
        >
          <Image
            src={data.userImage ?? "/fallback-avatar.png"}
            alt={data.userName}
            width={44}
            height={44}
            className="rounded-full ring-2 ring-transparent group-hover:ring-primary/50 transition-all"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">{data.userName}</span>
              {data.userTier === "premium" && (
                <CrownSimpleIcon
                  size={16}
                  weight="fill"
                  className="text-yellow-500"
                />
              )}
            </div>
            <span className="text-xs text-primary font-medium">
              @{data.username}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isOwner && (
            <DeleteDialog
              onDelete={() => deleteMutation.mutate()}
              isPending={deleteMutation.isPending}
            />
          )}

          <ActionButton
            onClick={() => downloadMutation.mutate()}
            icon={
              <DownloadSimpleIcon
                size={20}
                className={downloadMutation.isPending ? "animate-bounce" : ""}
              />
            }
            label={data.downloads.toString()}
            tooltip="Download Cursor"
            disabled={downloadMutation.isPending}
          />

          <ActionButton
            onClick={() => likeMutation.mutate()}
            icon={
              <HeartIcon
                size={20}
                weight={data.likedByUser ? "fill" : "regular"}
              />
            }
            label={data.likes.toString()}
            tooltip={data.likedByUser ? "Unlike" : "Like"}
            variant={data.likedByUser ? "default" : "outline"}
          />
        </div>
      </div>
    </div>
  );
}

type ActionButtonProps = {
  onClick?: ComponentProps<typeof Button>["onClick"];
  icon: ReactNode;
  label: string | number;
  tooltip?: ReactNode;
  variant?: ComponentProps<typeof Button>["variant"];
  disabled?: ComponentProps<typeof Button>["disabled"];
};

function ActionButton({
  onClick,
  icon,
  label,
  tooltip,
  variant = "outline",
  disabled,
}: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          onClick={onClick}
          disabled={disabled}
          className="gap-2"
        >
          {icon}
          <span>{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function DeleteDialog({
  onDelete,
  isPending,
}: {
  onDelete: () => void;
  isPending: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isPending} className="gap-2">
          <TrashSimpleIcon size={20} />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <WarningCircleIcon size={20} className="text-destructive" />
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            cursor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function NotFoundState() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold">Cursor not found</h2>
      <Button asChild variant="link">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
