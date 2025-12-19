"use client";

import { CheckCircleIcon, CoinVerticalIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PricingPage() {
  const title = "Pricing";
  const description = "Check out our affordable pricing plans.";
  const icon = <CoinVerticalIcon size={42} />;

  const plans = [
    {
      name: "free",
      badge: "Free",
      monthlyPrice: "$0",
      features: [
        "Unlimited downloads",
        "Unlimited free uploads",
        "Publish 1 paid cursor",
        "Standard visibility",
      ],
      buttonText: "Your plan",
    },
    {
      name: "premium",
      badge: "Premium",
      monthlyPrice: "$5",
      features: [
        "Unlimited downloads",
        "Unlimited free uploads",
        "Unlimited paid cursor uploads",
        "Top creators section",
        "Higher search visibility",
      ],
      buttonText: "Upgrade",
    },
  ];

  return (
    <section>
      <div>
        <div className="flex flex-col gap-6">
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
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex w-full flex-col rounded-lg border p-6 text-left`}
              >
                <Badge className="mb-8 block w-fit uppercase">
                  {plan.badge}
                </Badge>

                <span className="text-4xl font-medium">
                  {plan.monthlyPrice}
                </span>

                <p
                  className={`text-muted-foreground ${
                    plan.monthlyPrice === "$0" ? "invisible" : ""
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

                  <Button className="w-full">{plan.buttonText}</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
