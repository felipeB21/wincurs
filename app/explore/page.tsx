"use client";

import { BinocularsIcon } from "@phosphor-icons/react";

export default function ExplorePage() {
  const title = "Explore";
  const description = "Explore the cursors";
  const icon = <BinocularsIcon size={42} />;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{title}</h2>
        {icon}
      </div>
      <p className="max-w-3xl text-muted-foreground lg:text-xl">
        {description}
      </p>
    </div>
  );
}
