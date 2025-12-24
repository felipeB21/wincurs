import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { eq } from "drizzle-orm";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: "sandbox",
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: ["https://inextricable-stefanie-philately.ngrok-free.dev/"],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: async (profile) => {
        return {
          username: profile.email.split("@")[0],
          displayUsername: profile.email.split("@")[0],
        };
      },
    },
  },
  user: {
    additionalFields: {
      tier: {
        type: ["free", "premium"],
        required: false,
        defaultValue: "free",
        input: false,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  plugins: [
    username(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: process.env.POLAR_PREMIUM_PRODUCT_ID!,
              slug: "wincurs",
            },
          ],
          successUrl: "/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        usage(),
        portal(),
        webhooks({
          secret:
            process.env.POLAR_WEBHOOK_SECRET ||
            (() => {
              throw new Error(
                "POLAR_WEBHOOK_SECRET environment variable is required"
              );
            })(),

          onOrderUpdated: async ({ data }) => {
            const userId = data.customer.externalId;
            if (!userId) return;

            if (data.status === "paid") {
              await db
                .update(schema.user)
                .set({
                  tier: "premium",
                })
                .where(eq(schema.user.id, userId));
            }
          },
        }),
      ],
    }),
  ],
});
