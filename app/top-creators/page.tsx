import { Metadata } from "next";
import { fetchTopCreators } from "@/features/user/queries";
import { CreatorCard } from "@/components/user/creator-card";
import { Users2Icon } from "lucide-react";

export const metadata: Metadata = {
  title: "Top Creators - WinCurs",
  description: "Discover the most popular cursor creators on WinCurs.",
};

export default async function TopCreatorsPage() {
  const { creators } = await fetchTopCreators(50);

  return (
    <div className="container py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 text-center items-center">
        <div className="bg-primary/10 text-primary p-3 rounded-full mb-2">
          <Users2Icon size={32} />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Top Creators
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          The most talented designers in our community, ranked by total likes
          and downloads.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {creators.map((creator, index) => (
          <CreatorCard key={creator.id} creator={creator} rank={index + 1} />
        ))}
      </div>

      {creators.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No creators found yet. Be the first to publish a cursor!
        </div>
      )}
    </div>
  );
}
