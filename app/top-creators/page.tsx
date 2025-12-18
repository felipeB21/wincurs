"use client";
import { UsersIcon } from "@phosphor-icons/react";

export default function TopCreatorsPage() {
  const title = "Top Creators";
  const description = "Edit your profile";
  const icon = <UsersIcon size={42} />;
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
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
