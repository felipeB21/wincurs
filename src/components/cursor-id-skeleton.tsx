import { Skeleton } from "@/components/ui/skeleton";

export default function CursorIdSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-3">
      <Skeleton className="w-[350px] h-[30px] rounded-md" />
      <Skeleton className="w-full h-[350px] rounded-md" />
      <Skeleton className="w-[120px] h-[20px] rounded-md" />
      <div className="flex items-center gap-3 mt-1 w-max">
        <Skeleton className="w-[34px] h-[22px] rounded-md" />
        <Skeleton className="w-[34px] h-[22px] rounded-md" />
      </div>
    </div>
  );
}
