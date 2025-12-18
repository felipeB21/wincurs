"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { SpinnerGapIcon } from "@phosphor-icons/react";

export default function Google() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider: "google",
        errorCallbackURL: "/",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 w-full">
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">Or</span>
        <Separator className="flex-1" />
      </div>

      <Button
        className="mt-4 w-full flex items-center gap-2"
        variant="secondary"
        size="lg"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <>
            <SpinnerGapIcon className="h-4 w-4 animate-spin" />
            Redirecting…
          </>
        ) : (
          <>
            <Image src="/google-icon.svg" alt="Google" width={16} height={16} />
            Log in with Google
          </>
        )}
      </Button>
    </div>
  );
}
