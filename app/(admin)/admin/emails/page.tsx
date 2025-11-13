"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/hooks/use-toast";
import { useScheduledEmails } from "@/lib/api/hooks/useScheduledEmails";
import {
  Mail,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Ban,
  RefreshCw,
  Send,
} from "lucide-react";
import Link from "next/link";

type StatusFilter = "all" | "pending" | "sent" | "failed" | "cancelled";

export default function AdminEmailsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());
  const [reschedulingIds, setReschedulingIds] = useState<Set<string>>(new Set());
  const limit = 50;
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useScheduledEmails({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit,
    offset,
  });

  const handleCancelEmail = async (emailId: string, recipientEmail: string) => {
    if (!confirm(`Are you sure you want to cancel this email to ${recipientEmail}?`)) {
      return;
    }

    setCancellingIds((prev) => new Set(prev).add(emailId));

    try {
      const response = await fetch(`/api/admin/scheduled-emails/${emailId}/cancel`, {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Email cancelled successfully",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to cancel email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel email",
        variant: "destructive",
      });
    } finally {
      setCancellingIds((prev) => {
        const next = new Set(prev);
        next.delete(emailId);
        return next;
      });
    }
  };

  const handleRescheduleEmail = async (emailId: string, recipientEmail: string) => {
    if (!confirm(`Reschedule this email to ${recipientEmail} to send immediately?`)) {
      return;
    }

    setReschedulingIds((prev) => new Set(prev).add(emailId));

    try {
      const response = await fetch(`/api/admin/scheduled-emails/${emailId}/reschedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Send empty body to trigger "now"
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.data?.message || "Email rescheduled successfully",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reschedule email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule email",
        variant: "destructive",
      });
    } finally {
      setReschedulingIds((prev) => {
        const next = new Set(prev);
        next.delete(emailId);
        return next;
      });
    }
  };

  const emails = data?.emails || [];
  const stats = data?.stats || {
    pending: 0,
    sent: 0,
    failed: 0,
    cancelled: 0,
  };

  // Filter emails by search query (client-side for simplicity)
  const filteredEmails = emails.filter((email) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      email.recipientEmail.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query) ||
      email.userEmail?.toLowerCase().includes(query) ||
      email.userName?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="success">Sent</Badge>;
      case "pending":
        return <Badge variant="default">Pending</Badge>;
      case "failed":
        return <Badge variant="danger">Failed</Badge>;
      case "cancelled":
        return <Badge variant="warning">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const extractSequenceInfo = (emailType: string) => {
    const match = emailType.match(/sequence_([^_]+)_(.+)/);
    if (match) {
      return {
        sequenceId: match[1],
        stepId: match[2],
      };
    }
    return null;
  };

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
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Scheduled Emails
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage all scheduled email campaigns
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.sent}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.failed}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cancelled
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.cancelled}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setStatusFilter("all");
                setOffset(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All ({stats.pending + stats.sent + stats.failed + stats.cancelled})
            </button>
            <button
              onClick={() => {
                setStatusFilter("pending");
                setOffset(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "pending"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => {
                setStatusFilter("sent");
                setOffset(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "sent"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Sent ({stats.sent})
            </button>
            <button
              onClick={() => {
                setStatusFilter("failed");
                setOffset(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "failed"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Failed ({stats.failed})
            </button>
            <button
              onClick={() => {
                setStatusFilter("cancelled");
                setOffset(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "cancelled"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Cancelled ({stats.cancelled})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by email, subject, or user name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Emails Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Emails ({data?.pagination.total || 0} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sequence
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Scheduled For
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sent At
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Promo Code
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredEmails.map((email) => {
                    const sequenceInfo = extractSequenceInfo(email.emailType);
                    return (
                      <tr
                        key={email.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-4 text-sm">
                          <div>
                            <div className="text-gray-900 dark:text-gray-100">
                              {email.recipientEmail}
                            </div>
                            {email.userName && (
                              <div className="text-gray-500 dark:text-gray-400 text-xs">
                                {email.userName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {email.subject}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {sequenceInfo ? (
                            <div>
                              <div className="font-medium">
                                {sequenceInfo.sequenceId.replace(/_/g, " ")}
                              </div>
                              <div className="text-xs">
                                Step: {sequenceInfo.stepId.replace(/_/g, " ")}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs">{email.emailType}</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {getStatusBadge(email.status)}
                          {email.error && (
                            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                              {email.error}
                            </div>
                          )}
                          {email.cancellationReason && (
                            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                              {email.cancellationReason}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(email.scheduledFor)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(email.sentAt)}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {email.promoCode ? (
                            <Badge variant="outline" className="font-mono">
                              {email.promoCode}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            {(email.status === "pending" || email.status === "failed") && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRescheduleEmail(email.id, email.recipientEmail)
                                  }
                                  disabled={reschedulingIds.has(email.id)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  title="Send now"
                                >
                                  {reschedulingIds.has(email.id) ? (
                                    <>
                                      <LoadingSpinner className="h-4 w-4 mr-1" />
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4 mr-1" />
                                      Send Now
                                    </>
                                  )}
                                </Button>
                                {email.status === "pending" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleCancelEmail(email.id, email.recipientEmail)
                                    }
                                    disabled={cancellingIds.has(email.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="Cancel email"
                                  >
                                    {cancellingIds.has(email.id) ? (
                                      <>
                                        <LoadingSpinner className="h-4 w-4 mr-1" />
                                        Cancelling...
                                      </>
                                    ) : (
                                      <>
                                        <Ban className="h-4 w-4 mr-1" />
                                        Cancel
                                      </>
                                    )}
                                  </Button>
                                )}
                              </>
                            )}
                            {email.status !== "pending" && email.status !== "failed" && (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredEmails.length === 0 && (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No emails found matching your criteria
                </p>
              </div>
            )}

            {/* Pagination */}
            {data && data.pagination.total > limit && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {offset + 1} to{" "}
                  {Math.min(offset + limit, data.pagination.total)} of{" "}
                  {data.pagination.total} emails
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={offset === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOffset(offset + limit)}
                    disabled={!data.pagination.hasMore}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

