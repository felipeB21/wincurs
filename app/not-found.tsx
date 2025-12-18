"use client";
import { Button } from "@/components/ui/button";
import { HouseIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 h-[90dvh]">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold">Page Not Found!</h2>
        <p className="text-xs text-gray-300 font-mono">
          Could not find the requested resource.
        </p>
      </div>
      <Button asChild size={"lg"}>
        <Link href={"/"} className="flex items-center gap-2">
          <HouseIcon />
          Return to Home
        </Link>
      </Button>
    </div>
  );
}
