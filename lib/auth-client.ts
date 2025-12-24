import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    usernameClient(),
    polarClient(),
    inferAdditionalFields({
      user: {
        tier: {
          type: ["premium", "free"],
        },
      },
    }),
  ],
});
