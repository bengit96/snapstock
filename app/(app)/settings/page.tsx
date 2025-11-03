"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { SubscriptionSection } from "@/components/settings/subscription-section";
import { ReferralSection } from "@/components/settings/referral-section";
import { UsageSection } from "@/components/settings/usage-section";
import { ROUTES } from "@/lib/constants";

function SettingsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("subscription");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(ROUTES.login);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading settings..." />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageLayout
        title="Account Settings"
        description="Manage your subscription, referrals, and usage"
        backUrl={ROUTES.analyze}
        backText="Back to analyze"
        className="bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-5xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="subscription" className="space-y-4">
              <SubscriptionSection user={session.user} />
            </TabsContent>

            <TabsContent value="referrals" className="space-y-4">
              <ReferralSection userId={session.user.id} />
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <UsageSection userId={session.user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ErrorBoundary>
      <SettingsContent />
    </ErrorBoundary>
  );
}
