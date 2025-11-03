"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PricingCard } from "@/components/pricing/pricing-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { usePageTracking } from "@/lib/hooks/usePageTracking";
import { ProductSchema } from "@/components/seo/product-schema";

interface PricingPlan {
  tier: "monthly" | "yearly" | "lifetime";
  title: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  badge?: string;
  badgeVariant?: "default" | "popular" | "lifetime";
  isPopular?: boolean;
  savings?: string;
  buttonVariant?: "default" | "outline";
  buttonText?: string;
}

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  // Track pricing page visit
  usePageTracking({
    eventType: "pricing_page_visit",
  });

  const handleSubscribe = async (tier: "monthly" | "yearly" | "lifetime") => {
    if (!session) {
      router.push(ROUTES.login);
      return;
    }

    setLoadingTier(tier);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  const plans: PricingPlan[] = [
    {
      tier: "monthly",
      title: "Monthly",
      price: 19.99,
      period: "per month",
      description: "Perfect for trying out the platform",
      features: [
        "Unlimited chart analyses",
        "Advanced AI analysis",
        "All 40+ trading signals",
        "Trade history tracking",
        "Cancel anytime",
      ],
      buttonVariant: "outline",
      buttonText: "Start Monthly",
    },
    {
      tier: "yearly",
      title: "Yearly",
      price: 199.99,
      period: "per year",
      description: "Most popular choice for serious traders",
      features: [
        "Everything in Monthly",
        "Priority AI processing",
        "Advanced analytics",
        "Export trade data",
        "Email support",
      ],
      badge: "BEST VALUE",
      badgeVariant: "popular",
      isPopular: true,
      savings: "Save 17%",
      buttonVariant: "default",
      buttonText: "Get Best Value",
    },
    {
      tier: "lifetime",
      title: "Lifetime",
      price: 599,
      period: "one-time payment",
      description: "Ultimate value for committed traders",
      features: [
        "Everything in Yearly",
        "Lifetime updates",
        "Early access features",
        "Priority support",
        "1-on-1 onboarding",
      ],
      badge: "LIFETIME",
      badgeVariant: "lifetime",
      buttonVariant: "outline",
      buttonText: "Get Lifetime Access",
    },
  ];

  const productOffers = plans.map((plan) => ({
    name: plan.title,
    price: plan.price,
    priceCurrency: "USD",
    description: plan.description,
    features: plan.features,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <ProductSchema offers={productOffers} />
      <div className="container mx-auto">
        {/* Back Link */}
        <Link
          href={ROUTES.home}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Trading Edge</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Unlock AI-powered long-bias chart analysis
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
            Exclusively for long momentum setups
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.tier}
              {...plan}
              onSubscribe={() => handleSubscribe(plan.tier)}
              isLoading={loadingTier === plan.tier}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-4">All plans include a 7-day money-back guarantee</p>
          <p className="text-sm">Payments are processed securely via Stripe</p>
        </div>
      </div>
    </div>
  );
}
