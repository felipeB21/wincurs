import MostLikedCursors from "@/components/cursor/most-liked";
import NewCursors from "@/components/cursor/new-cursors";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div>
      <NewCursors />
      <Separator className="my-10" />
      <MostLikedCursors />
    </div>
  );
}
