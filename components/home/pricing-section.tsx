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

  const handleSubscribe = async (
    tier: "free" | "monthly" | "yearly" | "lifetime"
  ) => {
    if (tier === "free") {
      // For free tier, scroll to upload section
      const uploadSection = document.getElementById("upload-chart");
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

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

  // Show free, monthly, and yearly plans on landing page
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold text-sm mb-4 shadow-lg">
            🎯 Start FREE - Upgrade Anytime
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Everyone gets 1 free analysis. Ready for more? Choose the plan that
            fits your trading style.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto px-2 md:px-0">
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
