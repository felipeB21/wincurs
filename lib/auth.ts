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

          successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret:
            process.env.POLAR_WEBHOOK_SECRET ||
            (() => {
              throw new Error(
                "POLAR_WEBHOOK_SECRET environment variable is required"
              );
            })(),
          onPayload: async ({ data, type }) => {
            if (type === "order.created" || type === "order.paid") {
              console.log("🎯 Processing payment webhook:", type);
              console.log("📦 Payload data:", JSON.stringify(data, null, 2));

              try {
                const userId = data.customer?.externalId;

                console.log(userId);
              } catch (error) {
                console.error(
                  "💥 Error processing subscription webhook:",
                  error
                );
              }
            }
          },
        }),
      ],
    }),
  ],
});
