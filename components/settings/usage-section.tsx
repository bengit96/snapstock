'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Activity, TrendingUp, Calendar } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useUsageStats } from '@/lib/hooks/useApi'

interface UsageSectionProps {
  userId: string
}

export function UsageSection({ userId }: UsageSectionProps) {
  const { data: stats, isLoading } = useUsageStats()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner message="Loading usage stats..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Free Trial Usage (if applicable) */}
      {stats?.freeAnalysesLimit && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle>Free Trial Usage</CardTitle>
            <CardDescription>
              Track your remaining free analyses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used</span>
                <span className="font-semibold">
                  {stats.freeAnalysesUsed || 0} / {stats.freeAnalysesLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${((stats.freeAnalysesUsed || 0) / stats.freeAnalysesLimit) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {(stats.freeAnalysesLimit - (stats.freeAnalysesUsed || 0))} free analyses remaining
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Analyses
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats?.totalAnalyses || 0}
                </p>
              </div>
              <BarChart className="w-10 h-10 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This Month
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats?.thisMonth || 0}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This Week
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats?.thisWeek || 0}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
          <CardDescription>
            Your latest chart analyses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
            <div className="space-y-3">
              {stats.recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-purple-600">
                        {analysis.grade}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {analysis.stockSymbol || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No analyses yet</p>
              <p className="text-sm mt-1">
                Upload a chart to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
