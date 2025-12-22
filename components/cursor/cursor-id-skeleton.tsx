"use client";
import { Skeleton } from "../ui/skeleton";

export default function CursorIdSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="w-auto h-100" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-4 w-100" />
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2 w-20" />
          <div className="w-max flex items-center gap-2">
            <Skeleton className="rounded-full w-10 h-10 " />
            <div className="flex flex-col items-start leading-none gap-1">
              <Skeleton className="h-2 w-12" />
              <Skeleton className="h-1 w-8" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-8 h-6" />
          <Skeleton className="w-8 h-6" />
        </div>
      </div>
    </div>
  );
}
