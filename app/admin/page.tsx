'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { Users, TrendingUp, Shield, BarChart3 } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  role: 'user' | 'admin'
  subscriptionStatus: string | null
  subscriptionTier: string | null
  subscriptionEndDate: string | null
  freeAnalysesUsed: number
  freeAnalysesLimit: number
  createdAt: string
  updatedAt: string
  totalAnalyses: number
}

interface AdminStats {
  totalUsers: number
  totalAdmins: number
  activeSubscriptions: number
  totalAnalyses: number
}

interface AdminData {
  users: User[]
  stats: AdminStats
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')

      if (!response.ok) {
        throw new Error(`Failed to fetch admin data: ${response.statusText}`)
      }

      const data = await response.json()
      setData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getSubscriptionBadge = (
    status: string | null,
    tier: string | null
  ) => {
    if (!status || status === 'inactive') {
      return <Badge variant="default">Free</Badge>
    }

    if (status === 'active') {
      const tierDisplay = tier === 'lifetime' ? 'Lifetime' : tier === 'yearly' ? 'Yearly' : 'Monthly'
      return <Badge variant="success">{tierDisplay}</Badge>
    }

    if (status === 'cancelled') {
      return <Badge variant="warning">Cancelled</Badge>
    }

    if (status === 'past_due') {
      return <Badge variant="danger">Past Due</Badge>
    }

    return <Badge variant="default">{status}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage message={error} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No data available</p>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Users',
      value: data.stats.totalUsers,
      icon: Users,
    },
    {
      label: 'Active Subscriptions',
      value: data.stats.activeSubscriptions,
      icon: TrendingUp,
    },
    {
      label: 'Total Analyses',
      value: data.stats.totalAnalyses,
      icon: BarChart3,
    },
    {
      label: 'Admins',
      value: data.stats.totalAdmins,
      icon: Shield,
    },
  ]

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
        </div>

        {/* Stats Cards */}
        <StatsCard stats={stats} columns={4} />

        {/* Users Table */}
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
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {user.name || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {user.role === 'admin' ? (
                          <Badge variant="danger">Admin</Badge>
                        ) : (
                          <Badge variant="default">User</Badge>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {getSubscriptionBadge(user.subscriptionStatus, user.subscriptionTier)}
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
  )
}
