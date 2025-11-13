import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import { toast } from "sonner";

interface UsageData {
  analysesUsed: number;
  analysesLimit: number | null;
  currentPeriodEnd: string | null;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  role: "user" | "admin";
}

interface CheckoutRequest {
  tier: "monthly" | "yearly" | "lifetime";
}

interface CheckoutResponse {
  url: string;
}

interface PortalResponse {
  url: string;
}

// Fetch billing usage data
export const useBillingUsage = () => {
  return useQuery<UsageData>({
    queryKey: ["billing", "usage"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/billing/usage");
      return data;
    },
    // Always fetch fresh data
    staleTime: 0, // Consider data stale immediately
    gcTime: 0, // Don't cache in memory (formerly cacheTime)
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when reconnecting
    // Poll every 10 seconds to catch updates quickly
    refetchInterval: 10 * 1000, // 10 seconds
    refetchIntervalInBackground: true,
  });
};

// Create Stripe checkout session
export const useCreateCheckout = () => {
  return useMutation<CheckoutResponse, Error, CheckoutRequest>({
    mutationFn: async (request) => {
      const { data } = await apiClient.post("/api/stripe/checkout", request);
      return data;
    },
    onSuccess: (data) => {
      // Redirect to checkout
      window.location.href = data.url;
      toast.loading("Redirecting to checkout...");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });
};

// Open Stripe billing portal
export const useOpenBillingPortal = () => {
  const queryClient = useQueryClient();

  return useMutation<PortalResponse, Error>({
    mutationFn: async () => {
      console.log("🔄 Billing Hook: Creating portal session");
      const { data } = await apiClient.post("/api/stripe/portal");
      console.log("✅ Billing Hook: Portal session created", {
        url: data.url?.substring(0, 50) + "...",
      });
      return data;
    },
    onSuccess: (data) => {
      console.log("🎯 Billing Hook: Portal opening successful");
      // Invalidate billing data before redirecting (user might cancel/upgrade in portal)
      queryClient.invalidateQueries({ queryKey: ["billing", "usage"] });
      // Redirect to portal
      window.location.href = data.url;
      toast.loading("Redirecting to billing portal...");
    },
    onError: (error: any) => {
      console.error("❌ Billing Hook: Portal opening failed", error);

      // Show specific error messages
      if (error.response?.data?.code === "PORTAL_NOT_CONFIGURED") {
        toast.error("Billing portal not configured. Please contact support.");
      } else {
        toast.error(
          error.response?.data?.error ||
            error.message ||
            "Failed to open billing portal"
        );
      }

      // Also invalidate on error to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["billing", "usage"] });
    },
  });
};
