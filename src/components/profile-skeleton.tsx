import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-14 w-14 rounded-full" />
      <Skeleton className="w-[100px] h-[20px] rounded-full" />
    </div>
  );
}
