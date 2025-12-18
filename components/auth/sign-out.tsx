"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { SignOutIcon } from "@phosphor-icons/react";

export default function SignOut() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      disabled={loading}
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onRequest: () => {
              setLoading(true);
            },
            onSuccess: () => {
              window.location.reload();
            },
            onError: () => {
              setLoading(false);
            },
          },
        })
      }
    >
      <SignOutIcon />
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
