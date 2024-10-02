import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="w-[100px] h-[20px] rounded-full" />
    </div>
  );
}
