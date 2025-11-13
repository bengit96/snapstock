"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminUsers } from "@/lib/api/hooks/useAdmin";
import {
  Mail,
  Search,
  CheckSquare,
  Square,
  Send,
  Filter,
  X,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { EmailComposerModal } from "@/components/admin/email-composer-modal";
import { EmailSequenceModal } from "@/components/admin/email-sequence-modal";
import Link from "next/link";

type FilterType = "all" | "free" | "paid" | "never_used" | "exhausted";

export default function AdminUsersPage() {
  const { data, isLoading, error } = useAdminUsers();
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [showSequenceModal, setShowSequenceModal] = useState(false);

  const users = data?.users || [];

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply filter
    if (filter === "free") {
      filtered = filtered.filter(
        (u) => !u.subscriptionStatus || u.subscriptionStatus === "inactive"
      );
    } else if (filter === "paid") {
      filtered = filtered.filter((u) => u.subscriptionStatus === "active");
    } else if (filter === "never_used") {
      filtered = filtered.filter((u) => u.totalAnalyses === 0);
    } else if (filter === "exhausted") {
      filtered = filtered.filter(
        (u) =>
          u.freeAnalysesUsed >= u.freeAnalysesLimit &&
          (!u.subscriptionStatus || u.subscriptionStatus === "inactive")
      );
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.email.toLowerCase().includes(query) ||
          u.name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [users, filter, searchQuery]);

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const clearSelection = () => {
    setSelectedUsers(new Set());
  };

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

  const FilterButton = ({
    type,
    label,
    count,
  }: {
    type: FilterType;
    label: string;
    count: number;
  }) => (
    <button
      onClick={() => setFilter(type)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        filter === type
          ? "bg-purple-600 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {label} ({count})
    </button>
  );

  if (isLoading) {
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

  const allCount = users.length;
  const freeCount = users.filter(
    (u) => !u.subscriptionStatus || u.subscriptionStatus === "inactive"
  ).length;
  const paidCount = users.filter(
    (u) => u.subscriptionStatus === "active"
  ).length;
  const neverUsedCount = users.filter((u) => u.totalAnalyses === 0).length;
  const exhaustedCount = users.filter(
    (u) =>
      u.freeAnalysesUsed >= u.freeAnalysesLimit &&
      (!u.subscriptionStatus || u.subscriptionStatus === "inactive")
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-3 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Select users and send targeted email campaigns
            </p>
          </div>
          {selectedUsers.size > 0 && (
            <div className="flex items-center gap-3">
              <Badge variant="default" className="text-base px-4 py-2">
                {selectedUsers.size} selected
              </Badge>
              <Button
                onClick={clearSelection}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button
                onClick={() => setShowSequenceModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Email Sequence
              </Button>
              <Button
                onClick={() => setShowEmailComposer(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Single Email
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <FilterButton type="all" label="All Users" count={allCount} />
          <FilterButton type="free" label="Free Users" count={freeCount} />
          <FilterButton type="paid" label="Paid Users" count={paidCount} />
          <FilterButton
            type="never_used"
            label="Never Used"
            count={neverUsedCount}
          />
          <FilterButton
            type="exhausted"
            label="Free Tier Exhausted"
            count={exhaustedCount}
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Users ({filteredUsers.length})
              </span>
              <button
                onClick={toggleAll}
                className="flex items-center gap-2 text-sm font-normal text-purple-600 hover:text-purple-700"
              >
                {selectedUsers.size === filteredUsers.length ? (
                  <>
                    <CheckSquare className="h-5 w-5" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Square className="h-5 w-5" />
                    Select All
                  </>
                )}
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 w-12"></th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Analyses
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Free Used
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedUsers.has(user.id)
                          ? "bg-purple-50 dark:bg-purple-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <td className="px-4 py-4">
                        {selectedUsers.has(user.id) ? (
                          <CheckSquare className="h-5 w-5 text-purple-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {user.name || "-"}
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
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {user.freeAnalysesUsed}/{user.freeAnalysesLimit}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No users found matching your criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Email Composer Modal */}
      {showEmailComposer && (
        <EmailComposerModal
          selectedUserIds={Array.from(selectedUsers)}
          onClose={() => setShowEmailComposer(false)}
          onSuccess={() => {
            setShowEmailComposer(false);
            setSelectedUsers(new Set());
          }}
        />
      )}

      {/* Email Sequence Modal */}
      {showSequenceModal && (
        <EmailSequenceModal
          selectedUserIds={Array.from(selectedUsers)}
          onClose={() => setShowSequenceModal(false)}
          onSuccess={() => {
            setShowSequenceModal(false);
            setSelectedUsers(new Set());
          }}
        />
      )}
    </div>
  );
}
