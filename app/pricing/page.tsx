"use client";

import {
  CheckCircleIcon,
  CoinVerticalIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function PricingPage() {
  const { data, isPending } = authClient.useSession();
  const title = "Pricing";
  const description = "Check out our affordable pricing plans.";
  const icon = <CoinVerticalIcon size={42} />;

  const [isLoading, setIsLoading] = useState<"checkout" | null>(null);

  const buyPremium = async () => {
    try {
      setIsLoading("checkout");
      await authClient.checkout({
        slug: "wincurs",
        referenceId: data?.user.id,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(null);
    }
  };

  const plans = [
    {
      name: "free",
      badge: "Free",
      price: "$0",
      description: "Forever free",
      features: [
        "Unlimited downloads",
        "Unlimited free uploads",
        "Publish 1 paid cursor",
        "Standard visibility",
      ],
    },
    {
      name: "premium",
      badge: "Premium",
      price: "$4.99",
      description: "One-time payment · Lifetime access",
      features: [
        "Unlimited downloads",
        "Unlimited free uploads",
        "Unlimited paid cursor uploads",
        "Top creators section",
        "Higher search visibility",
      ],
    },
  ];

  return (
    <section>
      <div>
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold text-pretty lg:text-6xl">
              {title}
            </h2>
            {icon}
          </div>

          <p className="max-w-3xl text-muted-foreground lg:text-xl">
            {description}
          </p>

          <div className="flex w-full flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => {
              const isCurrentPlan = data?.user.tier === plan.name;
              const isPremiumPlan = plan.name === "premium";

              return (
                <div
                  key={plan.name}
                  className="flex w-full flex-col rounded-lg border p-6 text-left"
                >
                  <Badge className="mb-8 block w-fit uppercase">
                    {plan.badge}
                  </Badge>

                  <span className="text-4xl font-medium">{plan.price}</span>
                  <p className="text-muted-foreground">{plan.description}</p>

                  <p
                    className={`text-muted-foreground ${
                      plan.price === "$0" ? "invisible" : ""
                    }`}
                  >
                    Per Month
                  </p>

                  <Separator className="my-6" />

                  <div className="flex h-full flex-col justify-between gap-20">
                    <ul className="space-y-4 text-muted-foreground">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircleIcon className="size-4" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.name !== "free" && (
                      <Button
                        className="w-full gap-2"
                        disabled={
                          isPending ||
                          isCurrentPlan ||
                          (!isPremiumPlan && data?.user.tier === "premium")
                        }
                        onClick={() => {
                          if (!isPremiumPlan) return;
                          if (data?.user.tier === "free") buyPremium();
                        }}
                      >
                        {isLoading === "checkout" && isPremiumPlan && (
                          <SpinnerIcon className="animate-spin" />
                        )}

                        {isCurrentPlan
                          ? "Current plan"
                          : isPremiumPlan
                          ? "Upgrade"
                          : "Free plan"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
