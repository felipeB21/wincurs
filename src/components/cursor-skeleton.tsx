import { Skeleton } from "@/components/ui/skeleton";

export default function CursorSkeleton() {
  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
      <Skeleton className="w-full h-[300px] rounded-md" />
      <Skeleton className="w-full h-[300px] rounded-md" />
      <Skeleton className="w-full h-[300px] rounded-md" />
      <Skeleton className="w-full h-[300px] rounded-md" />
      <Skeleton className="w-full h-[300px] rounded-md" />
      <Skeleton className="w-full h-[300px] rounded-md" />
      <Skeleton className="w-full h-[300px] rounded-md" />
      <Skeleton className="w-full h-[300px] rounded-md" />
    </div>
  );
}
