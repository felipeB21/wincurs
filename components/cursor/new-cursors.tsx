"use client";
import { SunHorizonIcon } from "@phosphor-icons/react";

export default function NewCursors() {
  const title = "New Cursors";
  const icon = <SunHorizonIcon size={42} />;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{title}</h2>
        {icon}
      </div>
    </div>
  );
}
