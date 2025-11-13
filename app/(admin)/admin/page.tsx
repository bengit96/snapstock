"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useAdminUsers, useAdminAnalytics } from "@/lib/api/hooks/useAdmin";
import {
  Users,
  TrendingUp,
  Shield,
  BarChart3,
  UserX,
  AlertTriangle,
  ShoppingCart,
  Activity,
  Clock,
  TrendingDown,
  DollarSign,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  // Use React Query hooks to fetch data
  const { data, isLoading: usersLoading, error: usersError } = useAdminUsers();
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAdminAnalytics();

  const loading = usersLoading || analyticsLoading;
  const error = usersError || analyticsError;

  const getSubscriptionBadge = (status: string | null, tier: string | null) => {
    if (!status || status === "inactive") {
      return <Badge variant="default">Free</Badge>;
    }

    if (status === "active") {
      const tierDisplay =
        tier === "lifetime"
          ? "Lifetime"
          : tier === "yearly"
          ? "Yearly"
          : "Monthly";
      return <Badge variant="success">{tierDisplay}</Badge>;
    }

    if (status === "cancelled") {
      return <Badge variant="warning">Cancelled</Badge>;
    }

    if (status === "past_due") {
      return <Badge variant="danger">Past Due</Badge>;
    }

    return <Badge variant="default">{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSegmentBadge = (segment: string) => {
    if (segment.includes("never generated")) {
      return <Badge variant="danger">Never Used</Badge>;
    }
    if (segment.includes("free tier")) {
      return <Badge variant="warning">Free Tier Exhausted</Badge>;
    }
    if (segment.includes("pricing")) {
      return <Badge variant="warning">Viewed Pricing</Badge>;
    }
    if (segment.includes("checkout")) {
      return <Badge variant="danger">Abandoned Cart</Badge>;
    }
    if (segment.includes("Paid customer")) {
      return <Badge variant="success">Paid</Badge>;
    }
    return <Badge variant="default">{segment}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage
          message={error instanceof Error ? error.message : "An error occurred"}
        />
      </div>
    );
  }

  if (!data || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No data available</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: data.stats.totalUsers,
      icon: Users,
    },
    {
      label: "Active Subscriptions",
      value: data.stats.activeSubscriptions,
      icon: TrendingUp,
    },
    {
      label: "Total Analyses",
      value: data.stats.totalAnalyses,
      icon: BarChart3,
    },
    {
      label: "Admins",
      value: data.stats.totalAdmins,
      icon: Shield,
    },
  ];

  const dropoffStats = [
    {
      label: "Never Generated",
      value: analytics.summary.usersWithZeroGenerations,
      icon: UserX,
    },
    {
      label: "Used Free Tier Only",
      value: analytics.summary.usersWithOneGeneration,
      icon: AlertTriangle,
    },
    {
      label: "Viewed Pricing, No Purchase",
      value: analytics.summary.viewedPricingNoPurchase,
      icon: TrendingDown,
    },
    {
      label: "Abandoned Checkout",
      value: analytics.summary.checkoutAbandoned,
      icon: ShoppingCart,
    },
  ];

  const conversionStats = [
    {
      label: "Signup → First Gen",
      value: `${analytics.conversionRates.signupToFirstGenRate}%`,
      icon: Activity,
    },
    {
      label: "First Gen → Payment",
      value: `${analytics.conversionRates.firstGenToPaymentRate}%`,
      icon: DollarSign,
    },
    {
      label: "Overall Conversion",
      value: `${analytics.conversionRates.overallConversionRate}%`,
      icon: TrendingUp,
    },
    {
      label: "Avg Time to First Gen",
      value: `${parseFloat(analytics.timing.avgTimeToFirstGenHours).toFixed(
        1
      )}h`,
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage users and view analytics
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/emails"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Mail className="h-5 w-5" />
              View Emails
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <Mail className="h-5 w-5" />
              Email Users
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Overview
          </h2>
          <StatsCard stats={stats} columns={4} />
        </div>

        {/* Drop-off Analysis */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Drop-off Analysis
          </h2>
          <StatsCard stats={dropoffStats} columns={4} />
        </div>

        {/* Conversion Metrics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Conversion Metrics
          </h2>
          <StatsCard stats={conversionStats} columns={4} />
        </div>

        {/* Recent Signups - Need Attention */}
        {analytics.recentSignups.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Recent Signups (Last 7 Days) -{" "}
                {
                  analytics.recentSignups.filter((s) => s.needsAttention).length
                }{" "}
                Need Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Analyses
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Signed Up
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {analytics.recentSignups.map((signup) => (
                      <tr
                        key={signup.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          signup.needsAttention
                            ? "bg-red-50 dark:bg-red-900/10"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {signup.email}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {signup.name || "-"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {signup.analysisCount}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {signup.isPaid ? (
                            <Badge variant="success">Paid</Badge>
                          ) : signup.needsAttention ? (
                            <Badge variant="danger">Inactive</Badge>
                          ) : (
                            <Badge variant="default">Active</Badge>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(signup.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Drop-off Segments Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Drop-off Segments (Top 100)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Segment
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Analyses
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Days Since Signup
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {analytics.dropoffSegments.map((segment) => (
                    <tr
                      key={segment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {segment.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {segment.name || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {getSegmentBadge(segment.segment)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {segment.analysisCount}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {segment.daysSinceSignup}d
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {segment.daysSinceLastActivity !== null
                          ? `${segment.daysSinceLastActivity}d ago`
                          : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {analytics.dropoffSegments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No drop-off data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Analyses
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {data.users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {user.name || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {user.role === "admin" ? (
                          <Badge variant="danger">Admin</Badge>
                        ) : (
                          <Badge variant="default">User</Badge>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {getSubscriptionBadge(
                          user.subscriptionStatus,
                          user.subscriptionTier
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {user.totalAnalyses}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No users found
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
