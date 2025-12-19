"use client";
import { HeartIcon } from "@phosphor-icons/react";

export default function MostLikedCursors() {
  const title = "Most Liked";
  const icon = <HeartIcon size={42} />;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{title}</h2>
        {icon}
      </div>
    </div>
  );
}
