"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogoCompact } from "@/components/common/logo";
import { ROUTES } from "@/lib/constants";
import { useBillingUsage } from "@/lib/api/hooks/useBilling";

interface UsageData {
  analysesUsed: number;
  analysesLimit: number | null;
  freeAnalysesLimit: number;
  currentPeriodEnd: string | null;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  role: "user" | "admin";
}
import {
  ChevronDown,
  CreditCard,
  LogOut,
  Home,
  TrendingUp,
  Crown,
  Zap,
  Shield,
  HeadphonesIcon,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SupportModal } from "@/components/support/support-modal";

export function AuthenticatedHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get username without domain
  const username = session?.user?.email?.split("@")[0] || "User";

  // Get first letter for avatar
  const avatarLetter = username[0].toUpperCase();

  // Always fetch fresh billing data instead of relying on cached session
  const { data: billingData } = useBillingUsage();

  // Use fresh billing data for subscription status
  const subscriptionTier = (billingData as any)?.subscriptionTier;
  const subscriptionStatus = (billingData as any)?.subscriptionStatus;
  const hasSubscription =
    subscriptionTier &&
    subscriptionTier !== "free" &&
    subscriptionStatus === "active";
  const isYearlyPlan = subscriptionTier === "yearly";
  const isAdmin = session?.user?.role === "admin";

  // Get usage data
  const analysesUsed = (billingData as UsageData)?.analysesUsed || 0;
  const analysesLimit = (billingData as UsageData)?.analysesLimit;
  const analysesRemaining =
    analysesLimit === null
      ? "Unlimited"
      : Math.max(0, analysesLimit - analysesUsed);

  // Determine if we should show the usage (only on analyze page or if running low)
  const isAnalyzePage = pathname === "/dashboard/analyze";
  const isRunningLow =
    analysesLimit !== null && analysesLimit - analysesUsed <= 5;

  const tabs = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Analyze", href: "/dashboard/analyze", icon: TrendingUp },
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Shield }] : []),
  ];

  const handleSignOut = async () => {
    console.log("Sign out initiated");
    console.log("Current session:", session);

    // Clear local storage/session storage that might cache session data
    localStorage.clear();
    sessionStorage.clear();

    try {
      // First, call the server-side logout endpoint
      const response = await fetch("/api/auth", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn(
          "Server-side logout failed, proceeding with client-side logout"
        );
      }

      // Then do client-side signOut with redirect
      await signOut({ callbackUrl: ROUTES.landing, redirect: true });
      console.log("Sign out completed successfully");
    } catch (error) {
      console.error("Sign out failed:", error);
      // Fallback: force redirect to home page
      window.location.href = ROUTES.landing;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/home">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <LogoCompact />
            </motion.div>
          </Link>

          {/* Tabs - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;
              return (
                <Link key={tab.href} href={tab.href}>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                    <button
                      className={cn(
                        "relative px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
                        isActive
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg -z-10"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                    </button>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Right side - Analyses count, Upgrade button and User avatar */}
          <div className="flex items-center gap-3">
            {/* Show loading spinner when session is loading */}
            {status === "loading" ? (
              <div className="flex items-center gap-2 px-3 py-1.5">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Loading...
                </span>
              </div>
            ) : (
              <>
                {/* Analyses Remaining Badge - Show on analyze page or when running low */}
                {(isAnalyzePage || isRunningLow) && !isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                      analysesLimit === null
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800"
                        : isRunningLow
                        ? "bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800"
                        : "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800"
                    )}
                  >
                    <TrendingUp
                      className={cn(
                        "w-4 h-4",
                        analysesLimit === null
                          ? "text-purple-600 dark:text-purple-400"
                          : isRunningLow
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-blue-600 dark:text-blue-400"
                      )}
                    />
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "text-xs font-semibold leading-none",
                          analysesLimit === null
                            ? "text-purple-700 dark:text-purple-300"
                            : isRunningLow
                            ? "text-orange-700 dark:text-orange-300"
                            : "text-blue-700 dark:text-blue-300"
                        )}
                      >
                        {analysesRemaining === "Unlimited"
                          ? "Unlimited"
                          : `${analysesRemaining} Left`}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {analysesLimit === null
                          ? "Analyses"
                          : `of ${analysesLimit} this month`}
                      </span>
                    </div>
                  </motion.div>
                )}
                {/* Upgrade Button - Only show if not on yearly plan */}
                {!isYearlyPlan && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:block"
                  >
                    <Link href="/billing">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md flex items-center gap-2"
                      >
                        {hasSubscription ? (
                          <>
                            <Zap className="w-4 h-4" />
                            Upgrade to Yearly
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4" />
                            Buy a Plan
                          </>
                        )}
                      </Button>
                    </Link>
                  </motion.div>
                )}

                {/* User Avatar with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {avatarLetter}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {username}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-gray-500 transition-transform",
                        dropdownOpen && "rotate-180"
                      )}
                    />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        {/* Backdrop for mobile */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40 md:hidden"
                          onClick={() => setDropdownOpen(false)}
                        />

                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                        >
                          {/* Mobile tabs */}
                          <div className="md:hidden border-b border-gray-200 dark:border-gray-700 p-2">
                            {tabs.map((tab) => {
                              const Icon = tab.icon;
                              const isActive = pathname === tab.href;
                              return (
                                <Link key={tab.href} href={tab.href}>
                                  <button
                                    onClick={() => setDropdownOpen(false)}
                                    className={cn(
                                      "w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 transition-colors",
                                      isActive
                                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    )}
                                  >
                                    <Icon className="w-4 h-4" />
                                    {tab.name}
                                  </button>
                                </Link>
                              );
                            })}
                          </div>

                          {/* Upgrade button mobile */}
                          {!isYearlyPlan && (
                            <div className="md:hidden p-2 border-b border-gray-200 dark:border-gray-700">
                              <Link href="/billing">
                                <button
                                  onClick={() => setDropdownOpen(false)}
                                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium"
                                >
                                  {hasSubscription ? (
                                    <>
                                      <Zap className="w-4 h-4" />
                                      Upgrade to Yearly
                                    </>
                                  ) : (
                                    <>
                                      <Crown className="w-4 h-4" />
                                      Buy a Plan
                                    </>
                                  )}
                                </button>
                              </Link>
                            </div>
                          )}

                          {/* User info with analysis count */}
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {avatarLetter}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {username}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {session?.user?.email}
                                </div>
                              </div>
                            </div>

                            {/* Mobile analysis count */}
                            {!isAdmin && (
                              <div
                                className={cn(
                                  "mt-3 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm",
                                  analysesLimit === null
                                    ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800"
                                    : isRunningLow
                                    ? "bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800"
                                    : "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800"
                                )}
                              >
                                <TrendingUp
                                  className={cn(
                                    "w-4 h-4",
                                    analysesLimit === null
                                      ? "text-purple-600 dark:text-purple-400"
                                      : isRunningLow
                                      ? "text-orange-600 dark:text-orange-400"
                                      : "text-blue-600 dark:text-blue-400"
                                  )}
                                />
                                <div className="flex-1">
                                  <div
                                    className={cn(
                                      "font-semibold text-xs",
                                      analysesLimit === null
                                        ? "text-purple-700 dark:text-purple-300"
                                        : isRunningLow
                                        ? "text-orange-700 dark:text-orange-300"
                                        : "text-blue-700 dark:text-blue-300"
                                    )}
                                  >
                                    {analysesRemaining === "Unlimited"
                                      ? "Unlimited Analyses"
                                      : `${analysesRemaining} analyses left`}
                                  </div>
                                  {analysesLimit !== null && (
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                      {analysesUsed} of {analysesLimit} used
                                      this month
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Menu items */}
                          <div className="p-2">
                            <Link href="/billing">
                              <button
                                onClick={() => setDropdownOpen(false)}
                                className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                              >
                                <CreditCard className="w-4 h-4" />
                                Billing & Usage
                              </button>
                            </Link>

                            <button
                              onClick={() => {
                                setDropdownOpen(false);
                                setSupportModalOpen(true);
                              }}
                              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                            >
                              <HeadphonesIcon className="w-4 h-4" />
                              Support & Feedback
                            </button>

                            <button
                              onClick={handleSignOut}
                              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-600 dark:text-red-400"
                            >
                              <LogOut className="w-4 h-4" />
                              Log out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Support Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        userEmail={session?.user?.email || undefined}
      />
    </header>
  );
}
