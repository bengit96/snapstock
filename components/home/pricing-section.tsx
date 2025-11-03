"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PricingCard } from "@/components/pricing/pricing-card";
import { Shield, Lock } from "lucide-react";
import { ROUTES, PRICING_PLANS } from "@/lib/constants";
import { motion } from "framer-motion";

export function PricingSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

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

  // Filter out lifetime plan for now (only show monthly and yearly on landing page)
  const plans = PRICING_PLANS.filter((plan) => plan.tier !== "lifetime");

  return (
    <section
      id="pricing"
      className="py-12 md:py-20 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px", amount: 0.3 }}
          transition={{ duration: 0.3 }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that fits your trading style
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto px-2 md:px-0">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px", amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <PricingCard
                {...plan}
                onSubscribe={() => handleSubscribe(plan.tier)}
                isLoading={loadingTier === plan.tier}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <span className="text-xs md:text-sm text-gray-500">
                Secure payment via Stripe
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <span className="text-xs md:text-sm text-gray-500">
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
